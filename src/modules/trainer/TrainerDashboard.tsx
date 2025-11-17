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
  MessageCircle,
  Dumbbell,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

interface DashboardStat {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const { userCredentials } = useAuth();

  // Get trainer data
  const { data: trainerData } = api.trainers.getTrainerData.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  // Get trainer's classes
  const { data: trainerClasses } = api.classes.getClassesByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  // Get bookings
  const { data: bookings } = api.bookings.getBookingsByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  // Get clients
  const { data: clients } = api.trainers.getClient.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  // Calculate stats
  const totalClients = clients?.length || 0;
  const pendingBookingsCount = bookings?.filter((b) => b.status === "Pending").length || 0;
  
  // Calculate monthly earnings
  const calculateMonthlyEarnings = () => {
    if (!bookings || !trainerClasses) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return bookings
      .filter((b) => {
        if (b.status !== "Approved") return false;
        const bookingDate = new Date(b.createdAt);
        return (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        );
      })
      .reduce((total, booking) => {
        const classInfo = trainerClasses.find((c) => c.classID === booking.classID);
        return total + (classInfo?.price || 0);
      }, 0);
  };

  const monthlyEarnings = calculateMonthlyEarnings();

  // Stats for dashboard cards
  const stats: DashboardStat[] = [
    {
      title: "Total Clients",
      value: totalClients,
      change: `${totalClients} active`,
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      title: "Active Classes",
      value: trainerClasses?.length || 0,
      change: "Your classes",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-green-500",
    },
    {
      title: "Pending Bookings",
      value: pendingBookingsCount,
      change: "Awaiting approval",
      icon: <Clock className="h-5 w-5" />,
      color: "text-yellow-500",
    },
    {
      title: "Monthly Earnings",
      value: `$${monthlyEarnings}`,
      change: "This month",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-accent",
    },
  ];

  // Get upcoming sessions (next 7 days)
  const getUpcomingSessions = () => {
    if (!trainerClasses) return [];
    
    return trainerClasses.slice(0, 3).map((classItem) => {
      const approvedCount = bookings?.filter(
        (b) => b.classID === classItem.classID && b.status === "Approved"
      ).length || 0;

      return {
        id: classItem.classID,
        class: classItem.className,
        date: "Recurring",
        time: classItem.time,
        duration: `${classItem.duration} min`,
        participants: approvedCount,
        capacity: classItem.capacity,
        type: classItem.price > 0 ? ("private" as const) : ("free" as const),
      };
    });
  };

  const upcomingSessions = getUpcomingSessions();

  // Get pending bookings
  const getPendingBookings = () => {
    if (!bookings) return [];
    
    return bookings
      .filter((b) => b.status === "Pending")
      .slice(0, 3)
      .map((booking) => ({
        id: booking.bookingID,
        clientName: booking.userName,
        class: booking.className,
        date: new Date(booking.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        time: booking.time,
        type: "private",
      }));
  };

  const pendingBookings = getPendingBookings();

  // Mutation for updating booking status
  const updateStatusMutation = api.trainers.updateBookingStatus.useMutation({
    onSuccess: (_, variables) => {
      const action = variables.status === "Approved" ? "approved" : "rejected";
      toast.success(`Booking ${action} successfully`);
      // Optionally refetch bookings
    },
    onError: () => {
      toast.error("Failed to update booking status");
    },
  });

  const handleApproveBooking = (bookingId: string) => {
    updateStatusMutation.mutate({ bookingId, status: "Approved" });
  };

  const handleRejectBooking = (bookingId: string) => {
    updateStatusMutation.mutate({ bookingId, status: "Rejected" });
  };

  // Recent activity (mock for now - can be enhanced with real data)
  const recentActivity = [
    {
      id: "1",
      type: "booking",
      message: `${pendingBookingsCount} new booking request${pendingBookingsCount !== 1 ? 's' : ''}`,
      time: "Recent",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      id: "2",
      type: "clients",
      message: `${totalClients} active client${totalClients !== 1 ? 's' : ''}`,
      time: "Active",
      icon: <Users className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "3",
      type: "earnings",
      message: `$${monthlyEarnings} earned this month`,
      time: "This month",
      icon: <TrendingUp className="h-4 w-4 text-accent" />,
    },
    {
      id: "4",
      type: "classes",
      message: `${trainerClasses?.length || 0} active classes`,
      time: "Teaching",
      icon: <Dumbbell className="h-4 w-4 text-yellow-500" />,
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
                onClick={() => navigate("/trainer/programs")}
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                Create Workout Plan
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate("/trainer/diet-plans")}
              >
                <Utensils className="mr-2 h-4 w-4" />
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
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleApproveBooking(booking.id)}
                        disabled={updateStatusMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleRejectBooking(booking.id)}
                        disabled={updateStatusMutation.isPending}
                      >
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
