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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  // Mock data - replace with API calls
  const stats = {
    totalUsers: 1248,
    totalTrainers: 42,
    monthlyRevenue: 87500,
    activeSessions: 156,
    newUsersThisMonth: 89,
    newTrainersThisMonth: 5,
    revenueGrowth: 12.5,
    activeBookings: 234,
  };

  const recentActivity = [
    {
      id: "1",
      type: "user",
      message: "New user registered: John Doe",
      time: "5 minutes ago",
    },
    {
      id: "2",
      type: "booking",
      message: "New booking: HIIT Cardio Blast",
      time: "12 minutes ago",
    },
    {
      id: "3",
      type: "trainer",
      message: "Trainer application submitted: Sarah Williams",
      time: "1 hour ago",
    },
    {
      id: "4",
      type: "order",
      message: "New order placed: Premium Food Box",
      time: "2 hours ago",
    },
    {
      id: "5",
      type: "revenue",
      message: "Payment received: $250 from Alex Johnson",
      time: "3 hours ago",
    },
  ];

  const pendingActions = [
    { id: "1", action: "Review 3 trainer applications", priority: "high" },
    { id: "2", action: "Approve 5 pending refund requests", priority: "medium" },
    { id: "3", action: "Update class schedules for next month", priority: "low" },
    { id: "4", action: "Respond to 8 support tickets", priority: "high" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and management center
        </p>
      </div>

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
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{stats.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeBookings} bookings pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <UserCog className="mr-2 h-4 w-4" />
              Review Trainer Applications
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Create New Class
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add Product
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              View Revenue Report
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border bg-gradient-card p-3"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      activity.type === "user"
                        ? "bg-blue-500"
                        : activity.type === "booking"
                        ? "bg-green-500"
                        : activity.type === "trainer"
                        ? "bg-purple-500"
                        : activity.type === "order"
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pending Actions</CardTitle>
          <CardDescription>Items requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingActions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border bg-gradient-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      item.priority === "high"
                        ? "bg-red-500"
                        : item.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.action}</span>
                </div>
                <Button size="sm">Review</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
