import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Clock, Loader2, User, X } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { getPendingBookingsByTrainerId } from "@/api/bookings";
import api from "@/api";

type BookingStatus = "pending" | "approved" | "rejected";

type TrainerBookingRequest = TrainerPendingBooking & {
  status: BookingStatus;
};

const normalizeStatus = (status: string): BookingStatus => {
  const normalized = status?.toLowerCase();
  if (normalized === "approved" || normalized === "rejected") {
    return normalized;
  }
  return "pending";
};

const formatClientDetails = (age: number | null, gender: string | null) => {
  const details: string[] = [];
  if (typeof age === "number" && age > 0) {
    details.push(`${age} yrs`);
  }
  if (gender) {
    details.push(gender);
  }
  return details.length > 0 ? details.join(" • ") : "Not provided";
};

const TrainerBookingsView = () => {
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: Boolean(userId),
  });
  const trainerId = trainer?.trainerID ?? "";

  const bookingsQuery = getPendingBookingsByTrainerId.useQuery(trainerId, {
    enabled: Boolean(trainerId),
  });

  const [bookings, setBookings] = useState<TrainerBookingRequest[]>([]);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const updateStatusMutation = api.trainers.updateBookingStatus.useMutation();

  const toApiStatus = (status: BookingStatus) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  useEffect(() => {
    if (bookingsQuery.data) {
      setBookings(
        bookingsQuery.data.map((booking) => ({
          ...booking,
          status: normalizeStatus(booking.status),
        }))
      );
    }
  }, [bookingsQuery.data]);

  const handleStatusChange = async (
    bookingId: string,
    status: BookingStatus
  ) => {
    setPendingActionId(bookingId);
    try {
      const apiStatus = toApiStatus(status);
      await updateStatusMutation.mutateAsync({ bookingId, status: apiStatus });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingID === bookingId ? { ...booking, status } : booking
        )
      );

      if (status === "approved") {
        toast.success("Booking request approved!");
      } else if (status === "rejected") {
        toast.error("Booking request rejected");
      }

      await bookingsQuery.refetch();
    } catch (error) {
      toast.error("Failed to update booking status. Please try again.");
    } finally {
      setPendingActionId(null);
    }
  };

  const handleApprove = (bookingId: string) =>
    handleStatusChange(bookingId, "approved");
  const handleReject = (bookingId: string) =>
    handleStatusChange(bookingId, "rejected");

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );
  const processedBookings = bookings.filter(
    (booking) => booking.status !== "pending"
  );

  if (!trainerId) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-md shadow-card">
          <CardContent className="py-10 text-center">
            <h2 className="text-lg font-semibold">Trainer account required</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with a trainer account to view booking requests.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Booking Requests</h1>
        <p className="text-muted-foreground">
          Review and manage client session requests
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Clock className="h-5 w-5 text-accent" />
          Pending Requests ({pendingBookings.length})
        </h2>

        {bookingsQuery.isLoading && bookings.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading pending bookings…
              </p>
            </CardContent>
          </Card>
        ) : bookingsQuery.isError ? (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center text-destructive">
              Failed to load pending bookings.
            </CardContent>
          </Card>
        ) : pendingBookings.length > 0 ? (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <Card key={booking.bookingID} className="shadow-card">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle>{booking.userName}</CardTitle>
                        <CardDescription>{booking.email}</CardDescription>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Class: {booking.className}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(booking.bookingID)}
                        disabled={
                          updateStatusMutation.isPending &&
                          pendingActionId === booking.bookingID
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updateStatusMutation.isPending &&
                        pendingActionId === booking.bookingID ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-1 h-4 w-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(booking.bookingID)}
                        disabled={
                          updateStatusMutation.isPending &&
                          pendingActionId === booking.bookingID
                        }
                      >
                        {updateStatusMutation.isPending &&
                        pendingActionId === booking.bookingID ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <X className="mr-1 h-4 w-4" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="mb-1 text-xs text-muted-foreground">
                        Schedule
                      </div>
                      <div className="font-semibold">{booking.time}</div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="mb-1 text-xs text-muted-foreground">
                        Duration
                      </div>
                      <div className="font-semibold">
                        {booking.duration} minutes
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="mb-1 text-xs text-muted-foreground">
                        Capacity
                      </div>
                      <div className="font-semibold">
                        {booking.assignedCount}/{booking.capacity} assigned
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="mb-1 text-xs text-muted-foreground">
                        Client details
                      </div>
                      <div className="font-semibold">
                        {formatClientDetails(booking.age, booking.gender)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="mb-3 h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="mb-1 font-semibold">No Pending Requests</h3>
              <p className="text-sm text-muted-foreground">
                All booking requests have been processed
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {processedBookings.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold">
            Recently Processed ({processedBookings.length})
          </h2>
          <div className="space-y-3">
            {processedBookings.map((booking) => (
              <Card key={booking.bookingID} className="shadow-card opacity-60">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold">{booking.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.className} • {booking.time}
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
