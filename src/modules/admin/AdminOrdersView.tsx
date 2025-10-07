import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, User, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";

interface Order {
  id: string;
  customer: string;
  products: string[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  date: Date;
}

const AdminOrdersView = () => {
  const [orders] = useState<Order[]>([
    { id: "ORD-001", customer: "Alex Johnson", products: ["Whey Protein", "Resistance Bands"], total: 79.98, status: "delivered", date: new Date("2025-10-01") },
    { id: "ORD-002", customer: "Sarah Williams", products: ["Yoga Mat Pro"], total: 39.99, status: "shipped", date: new Date("2025-10-03") },
    { id: "ORD-003", customer: "Mike Chen", products: ["Premium Food Box"], total: 89.99, status: "processing", date: new Date("2025-10-05") },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/10 text-green-600";
      case "shipped": return "bg-blue-500/10 text-blue-600";
      case "processing": return "bg-yellow-500/10 text-yellow-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Order Management</h1>
        <p className="text-muted-foreground">Track and manage customer orders</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border bg-gradient-card p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{order.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {order.customer}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {order.products.length} items
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {order.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${order.total}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersView;
