import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllOrders } from "@/api/orders";
import { getAllBookings } from "@/api/bookings";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#14b8a6', '#6366f1', '#f59e0b', '#ef4444'];

const AdminRevenueView = () => {
  const ordersQuery = getAllOrders.useQuery();
  const bookingsQuery = getAllBookings.useQuery();
  
  // Calculate bookings data
  const bookingsData = useMemo(() => {
    const bookings = bookingsQuery.data || [];
    
    const confirmedBookings = bookings.filter(b => b.status === "Approved");
    const pendingBookings = bookings.filter(b => b.status === "Pending");
    const rejectedBookings = bookings.filter(b => b.status === "Rejected");
    
    return {
      total: bookings.length,
      confirmed: confirmedBookings.length,
      pending: pendingBookings.length,
      rejected: rejectedBookings.length,
    };
  }, [bookingsQuery.data]);
  
  // Calculate revenue data from orders
  const revenueData = useMemo(() => {
    const orders = ordersQuery.data || [];
    
    // Total revenue from orders
    const totalOrders = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Count by status
    const confirmedOrders = orders.filter(o => o.status === "Confirmed");
    const totalConfirmed = confirmedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === "Pending");
    const totalPending = pendingOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Previous month comparison (mock for now - in real app, filter by date)
    const previousMonthTotal = totalOrders * 0.89; // Simulating previous month
    const growth = previousMonthTotal > 0 
      ? ((totalOrders - previousMonthTotal) / previousMonthTotal * 100).toFixed(1)
      : 0;
    
    return {
      total: totalOrders,
      confirmed: totalConfirmed,
      pending: totalPending,
      ordersCount: orders.length,
      growth: Number(growth),
    };
  }, [ordersQuery.data]);

  // Monthly breakdown from orders
  const monthlyBreakdown = useMemo(() => {
    const orders = ordersQuery.data || [];
    const monthlyData = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + order.totalAmount);
      }
    });
    
    return Array.from(monthlyData.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  }, [ordersQuery.data]);

  // Order status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const orders = ordersQuery.data || [];
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [ordersQuery.data]);

  // Bookings status distribution for pie chart
  const bookingStatusDistribution = useMemo(() => {
    const bookings = bookingsQuery.data || [];
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [bookingsQuery.data]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Revenue & Analytics</h1>
          <p className="text-muted-foreground">Financial performance overview</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      {(ordersQuery.isLoading || bookingsQuery.isLoading) && (
        <div className="text-center py-8">Loading revenue data...</div>
      )}

      {(ordersQuery.isError || bookingsQuery.isError) && (
        <div className="text-center py-8 text-destructive">Failed to load revenue data</div>
      )}

      {ordersQuery.data && bookingsQuery.data && (
        <>
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
                <CardTitle className="text-sm font-medium">Confirmed Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueData.confirmed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {revenueData.total > 0 ? ((revenueData.confirmed / revenueData.total) * 100).toFixed(1) : 0}% of total
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueData.pending.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {revenueData.total > 0 ? ((revenueData.pending / revenueData.total) * 100).toFixed(1) : 0}% of total
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueData.ordersCount}</div>
                <p className="text-xs text-muted-foreground">All time orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Bookings Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookingsData.total}</div>
                  <p className="text-xs text-muted-foreground">All time bookings</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookingsData.confirmed}</div>
                  <p className="text-xs text-muted-foreground">
                    {bookingsData.total > 0 ? ((bookingsData.confirmed / bookingsData.total) * 100).toFixed(1) : 0}% of total
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookingsData.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    {bookingsData.total > 0 ? ((bookingsData.pending / bookingsData.total) * 100).toFixed(1) : 0}% of total
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookingsData.rejected}</div>
                  <p className="text-xs text-muted-foreground">
                    {bookingsData.total > 0 ? ((bookingsData.rejected / bookingsData.total) * 100).toFixed(1) : 0}% of total
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* Monthly Revenue Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Bar dataKey="amount" fill="#14b8a6" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No monthly data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {statusDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusDistribution.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No status data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bookings Status Distribution */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Bookings Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingStatusDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bookingStatusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bookingStatusDistribution.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No bookings data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Monthly Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Monthly Revenue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyBreakdown.length > 0 ? (
                  monthlyBreakdown.map((month) => {
                    const maxAmount = Math.max(...monthlyBreakdown.map(m => m.amount));
                    return (
                      <div key={month.month} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">{month.month}</div>
                        <div className="flex-1 h-8 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent flex items-center px-3 text-white text-sm font-medium"
                            style={{ width: `${maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0}%` }}
                          >
                            ${month.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No monthly revenue data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminRevenueView;
