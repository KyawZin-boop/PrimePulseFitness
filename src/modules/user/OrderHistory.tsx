import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { getOrdersByUserId } from "@/api/orders";
import { Package, Calendar, DollarSign, LogIn, ShoppingBag } from "lucide-react";

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const { userCredentials, isAuthenticated } = useAuth();

  const userId = userCredentials?.userId ?? "";

  const ordersQuery = getOrdersByUserId.useQuery(userId, {
    queryKey: ["getOrdersByUserId", userId],
    enabled: Boolean(userId),
  });

  // If user is not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto pt-20 pb-8 px-4">
        <div className="mb-6">
          <h1 className="text-heading">My Orders</h1>
          <p className="text-muted-foreground">
            Review your past orders and details
          </p>
        </div>

        <Card className="shadow-card max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-6">
              <Package className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Login Required</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Please log in to view your order history
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/auth/login")} size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/shop")} 
                size="lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Shop
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      order.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : order.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                        : order.status === 'Rejected' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {order.status}
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
