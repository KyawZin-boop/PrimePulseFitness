import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/api/orders";
import { Download } from "lucide-react";

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const orderQuery = getOrderById.useQuery(orderId ?? "", {
    queryKey: ["getOrderById", orderId],
    enabled: Boolean(orderId),
  });

  const order = orderQuery.data;

  return (
    <div className="container mx-auto pt-20 pb-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-heading">Order Details</h1>
          <p className="text-muted-foreground">Review the order and receipt</p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Order {order?.orderID ?? orderId}</CardTitle>
        </CardHeader>
        <CardContent>
          {orderQuery.isLoading && <div>Loading...</div>}
          {orderQuery.isError && (
            <div className="text-destructive">Failed to load order</div>
          )}

          {order && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Placed</div>
                  <div className="font-medium">
                    {new Date(order.createdAt || Date.now()).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="font-medium">{order.totalAmount ?? "-"}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Products</div>
                <div className="mt-2 space-y-2">
                  {(order.products || []).map((p, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div>{p.productID}</div>
                      <div>{(p.price ?? 0) * (p.quantity ?? "-")}</div>
                    </div>
                  ))}
                </div>
              </div>

              {order.imageUrl && (
                <div>
                  <div className="text-sm text-muted-foreground">Receipt</div>
                  <div className="mt-2">
                    <img
                      src={order.imageUrl}
                      alt="receipt"
                      className="w-48 h-48 object-cover rounded-md border"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {order.imageUrl && (
                  <a href={order.imageUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2" /> Download Receipt
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
