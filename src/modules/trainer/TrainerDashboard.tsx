import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Dumbbell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStat {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

const TrainerDashboard = () => {
  const navigate = useNavigate();

  // Mock data - replace with API calls
  const stats: DashboardStat[] = [
    {
      title: "Total Clients",
      value: 28,
      change: "+4 this month",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      title: "Upcoming Sessions",
      value: 12,
      change: "Next 7 days",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-green-500",
    },
    {
      title: "Pending Bookings",
      value: 5,
      change: "Awaiting approval",
      icon: <Clock className="h-5 w-5" />,
      color: "text-yellow-500",
    },
    {
      title: "Monthly Earnings",
      value: "$3,240",
      change: "+12% from last month",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-accent",
    },
  ];

  const upcomingSessions = [
    {
      id: "1",
      class: "Strength Forge",
      date: "Oct 6, 2025",
      time: "09:00 AM",
      duration: "60 min",
      participants: 8,
      capacity: 15,
      type: "private" as const,
    },
    {
      id: "2",
      class: "Cardio Surge",
      date: "Oct 6, 2025",
      time: "02:00 PM",
      duration: "60 min",
      participants: 12,
      capacity: 20,
      type: "free" as const,
    },
    {
      id: "3",
      class: "Mind & Body Reset",
      date: "Oct 7, 2025",
      time: "10:00 AM",
      duration: "45 min",
      participants: 6,
      capacity: 10,
      type: "private" as const,
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "booking",
      message: "New booking request from Alex Johnson for Strength Forge",
      time: "2 hours ago",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      id: "2",
      type: "message",
      message: "Sarah Williams sent you a message",
      time: "4 hours ago",
      icon: <MessageCircle className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "3",
      type: "progress",
      message: "Client Mike Chen updated progress: -2kg weight loss",
      time: "Yesterday",
      icon: <TrendingUp className="h-4 w-4 text-accent" />,
    },
    {
      id: "4",
      type: "alert",
      message: "Session 'Cardio Surge' is almost full (18/20)",
      time: "Yesterday",
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    },
  ];

  const pendingBookings = [
    {
      id: "1",
      clientName: "Alex Johnson",
      class: "Strength Forge",
      date: "Oct 8, 2025",
      time: "09:00 AM",
      type: "private",
    },
    {
      id: "2",
      clientName: "Emma Davis",
      class: "Mind & Body Reset",
      date: "Oct 9, 2025",
      time: "10:00 AM",
      type: "private",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-heading mb-2">Trainer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your clients.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={stat.color}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    Upcoming Sessions
                  </CardTitle>
                  <CardDescription>Your scheduled classes</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/trainer/sessions")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border bg-gradient-card p-4 transition hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{session.class}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.date} at {session.time}
                      </p>
                    </div>
                    {session.type === "free" ? (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500">
                        FREE
                      </span>
                    ) : (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                        PRIVATE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {session.participants}/{session.capacity}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-accent" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="mt-0.5">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/trainer/sessions/new")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Create New Session
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/trainer/diet-plans/new")}
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                Create Diet Plan
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/trainer/clients")}
              >
                <Users className="mr-2 h-4 w-4" />
                View Clients
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/trainer/messages")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </CardContent>
          </Card>

          {/* Pending Bookings */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    Pending Bookings
                  </CardTitle>
                  <CardDescription>Awaiting your approval</CardDescription>
                </div>
                {pendingBookings.length > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                    {pendingBookings.length}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingBookings.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No pending bookings
                </p>
              ) : (
                pendingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-lg border bg-card p-3"
                  >
                    <h4 className="font-medium text-sm">{booking.clientName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {booking.class}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.date} at {booking.time}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" className="flex-1">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {pendingBookings.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/trainer/bookings")}
                >
                  View All Requests
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
