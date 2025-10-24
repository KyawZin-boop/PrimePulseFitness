import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrderById } from "@/api/orders";
import { ArrowLeft, Download, Package, Calendar, DollarSign, ShoppingBag, Receipt } from "lucide-react";

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const orderQuery = getOrderById.useQuery(orderId ?? "", {
    queryKey: ["getOrderById", orderId],
    enabled: Boolean(orderId),
  });

  const order = orderQuery.data;

  const formatPlacedDate = (value?: string | null) => {
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
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto pt-20 pb-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading mb-2">Order Details</h1>
            <p className="text-muted-foreground">Order #{order?.orderID ?? orderId}</p>
          </div>
        </div>
      </div>

      {orderQuery.isLoading && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {orderQuery.isError && (
        <Card className="shadow-card border-destructive">
          <CardContent className="py-12 text-center">
            <div className="text-destructive font-medium">Failed to load order details</div>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
          </CardContent>
        </Card>
      )}

      {order && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="shadow-card">
            <CardHeader className="bg-gradient-card">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-accent" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Placed On
                  </div>
                  <div className="font-medium text-lg">
                    {formatPlacedDate(order.createdAt)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Total Amount
                  </div>
                  <div className="font-bold text-2xl text-accent">
                    ${order.totalAmount ?? "0.00"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="shadow-card">
            <CardHeader className="bg-gradient-card">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                Products ({order.products?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {(order.products || []).map((product, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {product.productName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Badge variant="secondary" className="px-2 py-0.5">
                              Qty: {product.quantity ?? 1}
                            </Badge>
                          </span>
                          <span>Price: ${product.price ?? 0}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Subtotal</div>
                        <div className="font-bold text-xl text-accent">
                          ${((product.price ?? 0) * (product.quantity ?? 1)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Receipt */}
          {order.imageUrl && (
            <Card className="shadow-card">
              <CardHeader className="bg-gradient-card">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-accent" />
                  Payment Receipt
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={order.imageUrl}
                      alt="Payment receipt"
                      className="w-full md:w-80 h-auto object-contain rounded-lg border-2 border-border shadow-md hover:shadow-lg transition-shadow"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Receipt Information</h3>
                      <p className="text-sm text-muted-foreground">
                        This is the payment receipt submitted for this order.
                      </p>
                    </div>
                    <a 
                      href={order.imageUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block"
                    >
                      <Button variant="outline" className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
