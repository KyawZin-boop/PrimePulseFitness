import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllOrders } from "@/api/orders";
import useAuth from "@/hooks/useAuth";
import { Package, Calendar, CheckCircle2, Clock, Truck, MapPin } from "lucide-react";

const DeliveryView: React.FC = () => {
  const { userCredentials } = useAuth();
  
  const ordersQuery = getAllOrders.useQuery({
    queryKey: ["getAllOrders"],
  });

  const approvedOrders = React.useMemo(() => {
    if (!ordersQuery.data || !userCredentials?.userId) return [];
    
    return ordersQuery.data.filter(
      (order) => order.status === "Confirmed" && order.userID === userCredentials.userId
    );
  }, [ordersQuery.data, userCredentials?.userId]);

  const formatDate = (value?: string | null) => {
    const normalizedValue = (() => {
      if (!value) {
        return undefined;
      }

      const hasTimeZone = /[zZ]|([+-]\d{2}:?\d{2})$/.test(value);
      return hasTimeZone ? value : `${value}Z`;
    })();

    const parsed = normalizedValue ? new Date(normalizedValue) : new Date();

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDeliveryDate = (approvalDate?: string | null) => {
    if (!approvalDate) return null;

    const normalizedValue = (() => {
      const hasTimeZone = /[zZ]|([+-]\d{2}:?\d{2})$/.test(approvalDate);
      return hasTimeZone ? approvalDate : `${approvalDate}Z`;
    })();

    const parsed = new Date(normalizedValue);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    // Add 3 days (3 * 24 * 60 * 60 * 1000 milliseconds)
    const deliveryDate = new Date(parsed.getTime() + 3 * 24 * 60 * 60 * 1000);
    return deliveryDate;
  };

  const getDeliveryStatus = (approvalDate?: string | null) => {
    const deliveryDate = calculateDeliveryDate(approvalDate);
    if (!deliveryDate) return "unknown";

    const now = new Date();
    const approvalTime = new Date(approvalDate!).getTime();
    const deliveryTime = deliveryDate.getTime();
    const currentTime = now.getTime();

    if (currentTime >= deliveryTime) {
      return "delivered";
    } else if (currentTime >= approvalTime + 24 * 60 * 60 * 1000) {
      return "in-transit";
    } else {
      return "processing";
    }
  };

  const DeliveryTimeline = ({ status }: { status: string }) => {
    const steps = [
      { key: "confirmed", label: "Order Confirmed", icon: CheckCircle2 },
      { key: "processing", label: "Processing", icon: Package },
      { key: "in-transit", label: "In Transit", icon: Truck },
      { key: "delivered", label: "Delivered", icon: MapPin },
    ];

    const currentIndex = steps.findIndex((step) => step.key === status);

    return (
      <div className="relative py-6">
        {/* Timeline line */}
        <div className="absolute left-0 right-0 top-12 h-0.5 bg-muted">
          <div 
            className="h-full bg-accent transition-all duration-500"
            style={{ 
              width: `${(currentIndex / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 transition-all
                    ${
                      isCompleted
                        ? "bg-accent border-accent text-white"
                        : "bg-background border-muted-foreground/30"
                    }
                    ${isCurrent ? "ring-4 ring-accent/20 scale-110" : ""}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs font-medium ${
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-20 pb-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Delivery Tracking</h1>
        <p className="text-muted-foreground">
          Track your approved orders and delivery status
        </p>
      </div>

      {ordersQuery.isLoading && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {ordersQuery.isError && (
        <Card className="shadow-card border-destructive">
          <CardContent className="py-12 text-center">
            <div className="text-destructive font-medium">Failed to load orders</div>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
          </CardContent>
        </Card>
      )}

      {ordersQuery.isSuccess && approvedOrders.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Approved Orders</h2>
            <p className="text-muted-foreground">
              You don't have any approved orders to track yet.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {approvedOrders.map((order) => {
          const deliveryDate = calculateDeliveryDate(order.createdAt);
          const deliveryStatus = getDeliveryStatus(order.createdAt);

          return (
            <Card key={order.orderID} className="shadow-card">
              <CardHeader className="">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-accent" />
                    Order #{order.orderID}
                  </CardTitle>
                  <Badge variant="default" className="bg-green-500">
                    Approved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Delivery Timeline */}
                <DeliveryTimeline status={deliveryStatus} />

                {/* Delivery Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Order Date</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">
                        {deliveryDate ? formatDate(deliveryDate.toISOString()) : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10">
                      <Package className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="font-bold text-accent">${order.totalAmount ?? "0.00"}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {(order.products || []).map((product, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {product.quantity ?? 1}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-accent">
                            ${((product.price ?? 0) * (product.quantity ?? 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Note */}
                {deliveryStatus === "delivered" ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="font-medium">Order has been delivered!</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <div className="flex items-center gap-2 text-accent">
                      <Clock className="h-5 w-5" />
                      <p className="font-medium">
                        Your order will arrive within 3 days of approval
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryView;
