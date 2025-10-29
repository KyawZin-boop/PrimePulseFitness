import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrainerEarningsView = () => {
  const { userCredentials } = useAuth();

  const { data: trainerData } = api.trainers.getTrainerData.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  const { data: trainerClasses } = api.classes.getClassesByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  const { data: bookings } = api.bookings.getBookingsByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  const calculateTotalEarnings = () => {
    if (!bookings || !trainerClasses) return 0;
    const approvedBookings = bookings.filter((b) => b.status === "Approved");
    return approvedBookings.reduce((total, booking) => {
      const classInfo = trainerClasses.find((c) => c.classID === booking.classID);
      return total + (classInfo?.price || 0);
    }, 0);
  };

  const calculatePendingEarnings = () => {
    if (!bookings || !trainerClasses) return 0;
    const pendingBookings = bookings.filter((b) => b.status === "Pending");
    return pendingBookings.reduce((total, booking) => {
      const classInfo = trainerClasses.find((c) => c.classID === booking.classID);
      return total + (classInfo?.price || 0);
    }, 0);
  };

  const totalEarnings = calculateTotalEarnings();
  const pendingEarnings = calculatePendingEarnings();
  const approvedBookingsCount = bookings?.filter((b) => b.status === "Approved").length || 0;
  const avgPerBooking = approvedBookingsCount > 0 ? totalEarnings / approvedBookingsCount : 0;

  const classTransactions = trainerClasses?.map((classInfo) => {
    const classBookings = bookings?.filter(
      (b) => b.classID === classInfo.classID && b.status === "Approved"
    ) || [];
    const earnings = classBookings.length * classInfo.price;
    return {
      classID: classInfo.classID,
      className: classInfo.className,
      price: classInfo.price,
      bookingsCount: classBookings.length,
      earnings,
    };
  }).filter((t) => t.bookingsCount > 0) || [];

  // Calculate monthly earnings for trend chart
  const getMonthlyEarnings = () => {
    if (!bookings || !trainerClasses) return [];

    const monthlyData: Record<string, number> = {};
    
    // Group approved bookings by month
    bookings
      .filter((b) => b.status === "Approved")
      .forEach((booking) => {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const classInfo = trainerClasses.find((c) => c.classID === booking.classID);
        
        if (classInfo) {
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + classInfo.price;
        }
      });

    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      months.push({
        month: monthName,
        earnings: monthlyData[monthKey] || 0,
      });
    }

    return months;
  };

  const monthlyEarnings = getMonthlyEarnings();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Earnings</h1>
          <p className="text-muted-foreground">Track your income</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings}</div>
            <p className="text-xs text-muted-foreground">From {approvedBookingsCount} bookings</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainerClasses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Classes you teach</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingEarnings}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Per Booking</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgPerBooking.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Based on {approvedBookingsCount} bookings</p>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Earnings by Class</CardTitle>
          <CardDescription>Revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classTransactions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No earnings yet</div>
            ) : (
              classTransactions.map((transaction) => (
                <div key={transaction.classID} className="flex items-center justify-between rounded-lg border bg-gradient-card p-4">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{transaction.className}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{transaction.bookingsCount} bookings</span>
                      <span></span>
                      <span>${transaction.price} per session</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${transaction.earnings}</div>
                    <div className="text-xs text-green-600">Approved</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-card mt-6">
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Monthly revenue trend (last 6 months)</CardDescription>
        </CardHeader>
        <CardContent>
          {totalEarnings === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-2" />
                <p className="text-muted-foreground">No earnings data yet</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={monthlyEarnings}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: number) => [`$${value}`, 'Earnings']}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerEarningsView;
