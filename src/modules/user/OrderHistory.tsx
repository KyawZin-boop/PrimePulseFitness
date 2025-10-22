import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { getOrdersByUserId } from "@/api/orders";
import { Package, Calendar, DollarSign } from "lucide-react";

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const { userCredentials } = useAuth();

  const userId = userCredentials?.userId ?? "";

  const ordersQuery = getOrdersByUserId.useQuery(userId, {
    queryKey: ["getOrdersByUserId", userId],
    enabled: Boolean(userId),
  });

  return (
    <div className="container mx-auto pt-20 pb-8 px-4">
      <div className="mb-6">
        <h1 className="text-heading">My Orders</h1>
        <p className="text-muted-foreground">
          Review your past orders and details
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersQuery.isLoading && <div>Loading orders...</div>}
          {ordersQuery.isError && (
            <div className="text-destructive">Failed to load orders</div>
          )}

          {ordersQuery.data && ordersQuery.data.length === 0 && (
            <div className="text-muted-foreground">You have no orders yet.</div>
          )}

          <div className="space-y-3 mt-3">
            {ordersQuery.data?.map((order) => (
              <div
                key={order.orderID}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="font-semibold">{order.orderID}</div>
                  <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {(order.products || []).length} items
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(
                        order.createdAt || Date.now()
                      ).toUTCString().slice(0, 16)}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {order.totalAmount ?? "-"}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/orders/${order.orderID}`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;
