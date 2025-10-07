import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X, Clock, User, Calendar } from "lucide-react";
import { toast } from "sonner";

interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhoto?: string;
  sessionType: string;
  preferredDate: Date;
  preferredTime: string;
  duration: number;
  message?: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: Date;
}

const TrainerBookingsView = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([
    {
      id: "1",
      clientName: "Emma Davis",
      clientEmail: "emma.davis@example.com",
      clientPhoto: "https://i.pravatar.cc/150?img=9",
      sessionType: "Personal Training",
      preferredDate: new Date("2025-05-25"),
      preferredTime: "10:00 AM",
      duration: 60,
      message: "I'd like to focus on strength training and proper form.",
      status: "pending",
      requestedAt: new Date("2025-05-20"),
    },
    {
      id: "2",
      clientName: "James Wilson",
      clientEmail: "james.w@example.com",
      clientPhoto: "https://i.pravatar.cc/150?img=8",
      sessionType: "Nutrition Consultation",
      preferredDate: new Date("2025-05-26"),
      preferredTime: "2:00 PM",
      duration: 45,
      message: "Need help creating a meal plan for muscle gain.",
      status: "pending",
      requestedAt: new Date("2025-05-21"),
    },
    {
      id: "3",
      clientName: "Olivia Martinez",
      clientEmail: "olivia.m@example.com",
      clientPhoto: "https://i.pravatar.cc/150?img=16",
      sessionType: "Assessment Session",
      preferredDate: new Date("2025-05-27"),
      preferredTime: "4:00 PM",
      duration: 90,
      status: "pending",
      requestedAt: new Date("2025-05-22"),
    },
  ]);

  const handleApprove = (bookingId: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "approved" as const } : b
      )
    );
    toast.success("Booking request approved!");
  };

  const handleReject = (bookingId: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "rejected" as const } : b
      )
    );
    toast.error("Booking request rejected");
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const processedBookings = bookings.filter((b) => b.status !== "pending");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Booking Requests</h1>
        <p className="text-muted-foreground">
          Review and manage client session requests
        </p>
      </div>

      {/* Pending Requests */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Pending Requests ({pendingBookings.length})
        </h2>

        {pendingBookings.length > 0 ? (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <Card key={booking.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                        {booking.clientPhoto ? (
                          <img
                            src={booking.clientPhoto}
                            alt={booking.clientName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle>{booking.clientName}</CardTitle>
                        <CardDescription>{booking.clientEmail}</CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested {booking.requestedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(booking.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(booking.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        Session Type
                      </div>
                      <div className="font-semibold">{booking.sessionType}</div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        Preferred Date
                      </div>
                      <div className="font-semibold">
                        {booking.preferredDate.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        Preferred Time
                      </div>
                      <div className="font-semibold">{booking.preferredTime}</div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        Duration
                      </div>
                      <div className="font-semibold">{booking.duration} minutes</div>
                    </div>
                  </div>

                  {booking.message && (
                    <div className="rounded-lg border bg-gradient-card p-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        Client Message
                      </div>
                      <p className="text-sm">{booking.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground opacity-20 mb-3" />
              <h3 className="font-semibold mb-1">No Pending Requests</h3>
              <p className="text-muted-foreground text-sm">
                All booking requests have been processed
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Processed Requests */}
      {processedBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Recently Processed ({processedBookings.length})
          </h2>
          <div className="space-y-3">
            {processedBookings.map((booking) => (
              <Card key={booking.id} className="shadow-card opacity-60">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                        {booking.clientPhoto ? (
                          <img
                            src={booking.clientPhoto}
                            alt={booking.clientName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{booking.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.sessionType} • {booking.preferredDate.toLocaleDateString()} at {booking.preferredTime}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "approved"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {booking.status === "approved" ? "Approved" : "Rejected"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerBookingsView;
