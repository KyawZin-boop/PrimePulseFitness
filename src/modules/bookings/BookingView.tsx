import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, User, X } from "lucide-react";
import { useState } from "react";
import type { Booking, BookingStatus, ClassSession } from "@/types";
import { toast } from "sonner";

interface BookingViewProps {
  classId?: string;
}

const BookingView = ({ classId }: BookingViewProps) => {
  const [selectedSlot, setSelectedSlot] = useState<ClassSession | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Mock class sessions - replace with actual API call
  const sessions: ClassSession[] = [
    {
      id: "session-1",
      classId: "1",
      className: "Strength Forge",
      trainerId: "trainer-1",
      trainerName: "Mike Chen",
      date: new Date("2025-11-05"),
      startTime: "09:00",
      endTime: "10:00",
      duration: 60,
      maxCapacity: 15,
      currentBookings: 8,
      isFree: false,
      price: 25,
      location: "Studio A",
    },
    {
      id: "session-2",
      classId: "1",
      className: "Strength Forge",
      trainerId: "trainer-1",
      trainerName: "Mike Chen",
      date: new Date("2025-11-05"),
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      maxCapacity: 15,
      currentBookings: 12,
      isFree: false,
      price: 25,
      location: "Studio A",
    },
    {
      id: "session-3",
      classId: "2",
      className: "Cardio Surge",
      trainerId: "trainer-2",
      trainerName: "Sarah Williams",
      date: new Date("2025-11-05"),
      startTime: "11:00",
      endTime: "12:00",
      duration: 60,
      maxCapacity: 20,
      currentBookings: 5,
      isFree: true,
      price: 0,
      location: "Studio B",
    },
  ];

  // Mock user bookings - replace with actual API call
  const [myBookings, setMyBookings] = useState<Booking[]>([
    {
      id: "booking-1",
      userId: "user-1",
      sessionId: "session-1",
      bookingDate: new Date("2025-10-28"),
      status: "approved",
      sessionDetails: sessions[0],
    },
  ]);

  const handleBooking = () => {
    if (!selectedSlot) return;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId: "user-1", // Replace with actual user ID
      sessionId: selectedSlot.id,
      bookingDate: new Date(),
      status: "pending",
      sessionDetails: selectedSlot,
    };

    setMyBookings([...myBookings, newBooking]);
    setShowConfirmModal(false);
    setSelectedSlot(null);
    toast.success("Booking submitted! Waiting for approval.");
  };

  const handleCancelBooking = (bookingId: string) => {
    setMyBookings(
      myBookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as BookingStatus } : b
      )
    );
    toast.success("Booking cancelled successfully");
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-secondary text-foreground";
    }
  };

  const isSlotFull = (session: ClassSession) =>
    session.currentBookings >= session.maxCapacity;

  const filteredSessions = classId
    ? sessions.filter((s) => s.classId === classId)
    : sessions;

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8">
        <h1 className="text-heading mb-2 text-accent">Book a Session</h1>
        <p className="text-muted-foreground">
          Reserve your spot in upcoming fitness classes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Available Sessions */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Available Sessions
              </CardTitle>
              <CardDescription>
                Choose a time slot that works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredSessions.map((session) => {
                const spotsLeft = session.maxCapacity - session.currentBookings;
                const full = isSlotFull(session);

                return (
                  <div
                    key={session.id}
                    className="rounded-lg border bg-card p-4 transition hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {session.className}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          with {session.trainerName}
                        </p>
                      </div>
                      {session.isFree ? (
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
                          FREE
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-accent">
                          ${session.price}
                        </span>
                      )}
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {session.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {session.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {spotsLeft} spots left
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedSlot(session);
                        setShowConfirmModal(true);
                      }}
                      disabled={full}
                      className="w-full"
                    >
                      {full ? "Fully Booked" : "Book Now"}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* My Bookings */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>Your scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myBookings.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No bookings yet
                </p>
              ) : (
                myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-lg border bg-card p-3"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">
                          {booking.sessionDetails?.className}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {booking.sessionDetails?.date.toLocaleDateString()} at{" "}
                          {booking.sessionDetails?.startTime}
                        </p>
                      </div>
                      {booking.status !== "cancelled" &&
                        booking.status !== "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Review your session details before confirming
            </DialogDescription>
          </DialogHeader>
          {selectedSlot && (
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                <h3 className="font-semibold text-lg">
                  {selectedSlot.className}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trainer:</span>
                    <span>{selectedSlot.trainerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{selectedSlot.date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>
                      {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{selectedSlot.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{selectedSlot.duration} minutes</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Price:</span>
                    <span className="text-accent">
                      {selectedSlot.isFree ? "FREE" : `$${selectedSlot.price}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleBooking} className="flex-1">
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingView;
