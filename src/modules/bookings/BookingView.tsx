import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, LogIn, Calendar } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const BookingView = () => {
  const navigate = useNavigate();
  const { userCredentials, isAuthenticated } = useAuth();
  const userId = userCredentials?.userId || "";

  const { data: bookings, refetch } = api.bookings.getBookingsByUserId.useQuery(userId);
  const { data: classes } = api.classes.getAllClasses.useQuery();

  const handleCancelBooking = async (_bookingId: string) => {
    try {
      toast.success("Booking cancelled successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusColor = (status: string) => {
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

  const getClassDetails = (classId: string) => {
    return classes?.find((c: any) => c.classID === classId);
  };

  // If user is not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="mb-8">
          <h1 className="text-heading mb-2 text-accent">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your class bookings
          </p>
        </div>

        <Card className="shadow-card max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-6">
              <Calendar className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Login Required</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Please log in to view your bookings and manage your fitness classes
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/auth/login")} size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/classes")} 
                size="lg"
              >
                Browse Classes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8">
        <h1 className="text-heading mb-2 text-accent">My Bookings</h1>
        <p className="text-muted-foreground">
          View and manage your class bookings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Browse Classes</CardTitle>
            <CardDescription>Explore available fitness classes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/classes")} className="w-full">
              View All Classes
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>Your booked classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!bookings || bookings.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No bookings yet. Browse classes to get started!
              </p>
            ) : (
              bookings.map((booking: any) => {
                const classDetails = getClassDetails(booking.classID);
                return (
                  <div key={booking.bookingID} className="rounded-lg border bg-card p-3">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">
                          {classDetails?.className || "Class"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.bookingID)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingView;
