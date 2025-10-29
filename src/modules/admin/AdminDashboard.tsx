import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserCog,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity,
  ShoppingCart,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/api/user";
import { getAllTrainers } from "@/api/trainer";
import { getAllBookings } from "@/api/bookings";
import { getAllProducts } from "@/api/products";
import { getAllClasses } from "@/api/classes";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch all data
  const usersQuery = getAllUsers.useQuery();
  const trainersQuery = getAllTrainers.useQuery();
  const bookingsQuery = getAllBookings.useQuery();
  const productsQuery = getAllProducts.useQuery();
  const classesQuery = getAllClasses.useQuery();

  const users = usersQuery.data || [];
  const trainers = trainersQuery.data || [];
  const bookings = bookingsQuery.data || [];
  const products = productsQuery.data || [];
  const classes = classesQuery.data || [];

  // Calculate statistics
  const activeBookings = bookings.filter(b => b.activeFlag && b.status.toLowerCase() === "approved").length;
  const pendingBookings = bookings.filter(b => b.activeFlag && b.status.toLowerCase() === "pending").length;
  const activeUsers = users.filter(u => u.activeFlag).length;
  const subscribedUsers = users.filter(u => u.subscriptionStatus).length;
  
  // Calculate recent growth (users created in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsersThisMonth = users.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;
  const newTrainersThisMonth = trainers.filter(t => new Date(t.createdAt) > thirtyDaysAgo).length;

  const stats = {
    totalUsers: users.length,
    totalTrainers: trainers.length,
    totalProducts: products.length,
    totalClasses: classes.length,
    activeBookings,
    pendingBookings,
    newUsersThisMonth,
    newTrainersThisMonth,
    activeUsers,
    subscribedUsers,
  };

  // Prepare chart data - User growth over last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const userGrowthData = last7Days.map(date => {
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    const count = users.filter(u => {
      const createdAt = new Date(u.createdAt);
      return createdAt >= dayStart && createdAt <= dayEnd;
    }).length;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: count,
    };
  });

  // Booking status distribution
  const bookingStatusData = [
    { name: 'Approved', value: activeBookings, color: '#22c55e' },
    { name: 'Pending', value: pendingBookings, color: '#eab308' },
    { name: 'Rejected', value: bookings.filter(b => b.status.toLowerCase() === "rejected").length, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Class capacity data
  const classCapacityData = classes.slice(0, 5).map(c => ({
    name: c.className.length > 15 ? c.className.substring(0, 15) + '...' : c.className,
    enrolled: c.assignedCount || 0,
    capacity: c.capacity,
    available: c.capacity - (c.assignedCount || 0),
  }));

  const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6'];

  const isLoading = usersQuery.isLoading || trainersQuery.isLoading || 
                    bookingsQuery.isLoading || productsQuery.isLoading || classesQuery.isLoading;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and management center
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
          <span>Loading dashboard data...</span>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.newUsersThisMonth} this month
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeUsers} active • {stats.subscribedUsers} subscribed
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
                <UserCog className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTrainers}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.newTrainersThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Available in store
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Bookings
                </CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingBookings} pending approval
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* User Growth Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>User Growth (Last 7 Days)</CardTitle>
                <CardDescription>New user registrations per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Booking Status Distribution */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>Current booking statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Class Capacity Chart */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle>Class Enrollment Overview</CardTitle>
              <CardDescription>Current enrollment vs capacity for top classes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classCapacityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrolled" fill="#22c55e" name="Enrolled" />
                  <Bar dataKey="available" fill="#e5e7eb" name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users ({stats.totalUsers})
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/trainers')}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Manage Trainers ({stats.totalTrainers})
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/classes')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Classes ({stats.totalClasses})
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/products')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Manage Products ({stats.totalProducts})
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/bookings')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Bookings ({stats.activeBookings})
                </Button>
              </CardContent>
            </Card>

            {/* Platform Overview */}
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Platform Overview
                </CardTitle>
                <CardDescription>Key metrics and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border bg-gradient-card p-4">
                    <div>
                      <p className="text-sm font-medium">Total Classes</p>
                      <p className="text-2xl font-bold">{stats.totalClasses}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-accent" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-gradient-card p-4">
                      <p className="text-xs text-muted-foreground">Active Users</p>
                      <p className="text-xl font-bold">{stats.activeUsers}</p>
                      <p className="text-xs text-green-600">
                        {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    
                    <div className="rounded-lg border bg-gradient-card p-4">
                      <p className="text-xs text-muted-foreground">Subscribed Users</p>
                      <p className="text-xl font-bold">{stats.subscribedUsers}</p>
                      <p className="text-xs text-blue-600">
                        {((stats.subscribedUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-gradient-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Booking Overview</p>
                      <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold">{bookings.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Active</p>
                        <p className="text-lg font-bold text-green-600">{stats.activeBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pending</p>
                        <p className="text-lg font-bold text-yellow-600">{stats.pendingBookings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
