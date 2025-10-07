import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminRevenueView = () => {
  const revenueData = {
    total: 87500,
    sessions: 45200,
    memberships: 28300,
    products: 14000,
    growth: 12.5,
  };

  const monthlyBreakdown = [
    { month: "Jan", amount: 72000 },
    { month: "Feb", amount: 78000 },
    { month: "Mar", amount: 82000 },
    { month: "Apr", amount: 85000 },
    { month: "May", amount: 87500 },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Revenue & Analytics</h1>
          <p className="text-muted-foreground">Financial performance overview</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.total.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{revenueData.growth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.sessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">51.7% of total</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memberships</CardTitle>
            <CreditCard className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.memberships.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">32.3% of total</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.products.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">16% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyBreakdown.map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{month.month}</div>
                <div className="flex-1 h-8 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent flex items-center px-3 text-white text-sm font-medium"
                    style={{ width: `${(month.amount / 87500) * 100}%` }}
                  >
                    ${month.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenueView;
