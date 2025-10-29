import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, User, Calendar, DollarSign } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getAllOrders,
  confirmOrder,
  rejectOrder,
  getOrderById,
} from "@/api/orders";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-blue-500/10 text-blue-600";
    case "Pending":
      return "bg-orange-500/10 text-orange-600";
    case "Rejected":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-gray-500/10 text-gray-600";
  }
};

const AdminOrdersView = () => {
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ordersQuery = getAllOrders.useQuery();

  // dialog state for viewing order details inline
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const orderDetailQuery = getOrderById.useQuery(viewOrderId ?? "", {
    queryKey: ["getOrderById", viewOrderId ?? ""],
    enabled: Boolean(viewOrderId),
  });

  const confirmMutation = confirmOrder.useMutation({
    onSuccess: () => {
      toast.success("Order confirmed");
      queryClient.invalidateQueries({ queryKey: ["getAllOrders"] });
    },
    onError: () => toast.error("Failed to confirm order"),
  });

  const rejectMutation = rejectOrder.useMutation({
    onSuccess: () => {
      toast.success("Order rejected");
      queryClient.invalidateQueries({ queryKey: ["getAllOrders"] });
    },
    onError: () => toast.error("Failed to reject order"),
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Order Management</h1>
        <p className="text-muted-foreground">
          Track and manage customer orders
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Orders ({ordersQuery.data?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersQuery.isLoading && <div>Loading orders...</div>}
          {ordersQuery.isError && (
            <div className="text-destructive">Failed to load orders</div>
          )}

          <div className="space-y-3">
            {(ordersQuery.data || []).map((order: any) => (
              <div
                key={order.orderID || order.id}
                className="flex items-center justify-between rounded-lg border bg-gradient-card p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">
                      {order.orderID ?? order.id}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {order.userID ?? order.customer}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {(order.products || []).length} items
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {order.totalAmount ?? order.total}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewOrderId(order.orderID ?? order.id)}
                  >
                    View
                  </Button>
                  {order.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          confirmMutation.mutate(order.orderID ?? order.id)
                        }
                        disabled={(confirmMutation as any).isLoading}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          rejectMutation.mutate(order.orderID ?? order.id)
                        }
                        disabled={(rejectMutation as any).isLoading}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(viewOrderId)}
        onOpenChange={(open) => {
          if (!open) setViewOrderId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Review order items and receipt
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {orderDetailQuery.isLoading && <div>Loading...</div>}
            {orderDetailQuery.isError && (
              <div className="text-destructive">Failed to load order</div>
            )}

            {orderDetailQuery.data && (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Order ID</div>
                <div className="font-medium">
                  {orderDetailQuery.data.orderID}
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Items</div>
                  <div className="mt-2 space-y-2">
                    {(orderDetailQuery.data.products || []).map((p: any) => (
                      <div
                        key={p.orderDetailID}
                        className="flex items-center justify-between"
                      >
                        <div>{p.productName}</div>
                        <div>
                          {p.quantity} x {p.price}
                        </div>
                        <div className="font-semibold">
                          {(p.quantity * p.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {orderDetailQuery.data.imageUrl && (
                  <div>
                    <div className="text-sm text-muted-foreground">Receipt</div>
                    <div className="mt-2">
                      <img
                        src={orderDetailQuery.data.imageUrl}
                        alt="receipt"
                        className="w-48 h-48 object-cover rounded-md border"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersView;
