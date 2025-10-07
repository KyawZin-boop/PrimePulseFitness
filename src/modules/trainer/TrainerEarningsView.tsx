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
  CreditCard,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Earning } from "@/types";

const TrainerEarningsView = () => {
  // Mock earnings data - replace with API call
  const earnings: Earning[] = [
    {
      id: "1",
      trainerId: "trainer-1",
      amount: 150,
      source: "session",
      sourceId: "session-1",
      clientName: "Alex Johnson",
      date: new Date("2025-05-22"),
      status: "paid",
    },
    {
      id: "2",
      trainerId: "trainer-1",
      amount: 200,
      source: "diet_plan",
      sourceId: "diet-1",
      clientName: "Sarah Williams",
      date: new Date("2025-05-21"),
      status: "paid",
    },
    {
      id: "3",
      trainerId: "trainer-1",
      amount: 180,
      source: "session",
      sourceId: "session-2",
      clientName: "Mike Chen",
      date: new Date("2025-05-20"),
      status: "paid",
    },
    {
      id: "4",
      trainerId: "trainer-1",
      amount: 150,
      source: "session",
      sourceId: "session-3",
      clientName: "Emma Davis",
      date: new Date("2025-05-19"),
      status: "pending",
    },
    {
      id: "5",
      trainerId: "trainer-1",
      amount: 120,
      source: "program",
      sourceId: "program-1",
      clientName: "Group Class",
      date: new Date("2025-05-18"),
      status: "paid",
    },
  ];

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "session":
        return "Training Session";
      case "diet_plan":
        return "Diet Plan";
      case "program":
        return "Workout Program";
      default:
        return source;
    }
  };

  const totalEarnings = earnings
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingEarnings = earnings
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.amount, 0);

  const thisMonthEarnings = earnings
    .filter(
      (e) =>
        e.status === "paid" &&
        new Date(e.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, e) => sum + e.amount, 0);

  const lastMonthEarnings = 3250; // Mock data
  const growthPercentage =
    ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Earnings & Payments</h1>
          <p className="text-muted-foreground">
            Track your income and payment history
          </p>
        </div>

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings}</div>
            <p className="text-xs text-muted-foreground">All-time revenue</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${thisMonthEarnings}</div>
            <p
              className={`text-xs flex items-center gap-1 ${
                growthPercentage >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp className="h-3 w-3" />
              {growthPercentage >= 0 ? "+" : ""}
              {growthPercentage.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingEarnings}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Per Session
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalEarnings / earnings.length).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {earnings.length} sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest earnings and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {earnings.map((earning) => (
              <div
                key={earning.id}
                className="flex items-center justify-between rounded-lg border bg-gradient-card p-4"
              >
                <div className="flex-1">
                  <div className="font-semibold mb-1">
                    {getSourceLabel(earning.source)} - {earning.clientName}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {earning.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {getSourceLabel(earning.source)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">${earning.amount}</div>
                    <div
                      className={`text-xs ${
                        earning.status === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {earning.status === "paid" ? "Paid" : "Pending"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earnings Chart Placeholder */}
      <Card className="shadow-card mt-6">
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Monthly revenue trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-2" />
              <p className="text-muted-foreground">
                Chart visualization would appear here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Integration with charting library recommended
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerEarningsView;
