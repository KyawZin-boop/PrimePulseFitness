import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, DollarSign, User, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface Booking {
  id: string;
  clientName: string;
  className: string;
  date: Date;
  status: "confirmed" | "pending" | "cancelled";
  amount: number;
  paymentStatus: "paid" | "pending" | "refunded";
}

const AdminBookingsView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      clientName: "Alex Johnson",
      className: "HIIT Cardio Blast",
      date: new Date("2025-10-10"),
      status: "confirmed",
      amount: 25,
      paymentStatus: "paid",
    },
    {
      id: "2",
      clientName: "Sarah Williams",
      className: "Yoga Flow",
      date: new Date("2025-10-12"),
      status: "confirmed",
      amount: 20,
      paymentStatus: "paid",
    },
    {
      id: "3",
      clientName: "Mike Chen",
      className: "Strength & Conditioning",
      date: new Date("2025-10-15"),
      status: "pending",
      amount: 30,
      paymentStatus: "pending",
    },
  ]);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    revenue: bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.amount, 0),
  };

  const filteredBookings = bookings.filter((b) =>
    b.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Booking Management</h1>
        <p className="text-muted-foreground">View and manage all bookings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${stats.revenue}</div>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Bookings List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg border bg-gradient-card p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{booking.clientName}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-green-500/10 text-green-600"
                          : booking.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <span>{booking.className}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {booking.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${booking.amount}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookingsView;
