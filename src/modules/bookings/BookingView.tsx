import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  LogIn, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle,
  CalendarCheck
} from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const BookingView = () => {
  const navigate = useNavigate();
  const { userCredentials, isAuthenticated } = useAuth();
  const userId = userCredentials?.userId || "";

  const { data: bookings, refetch, isLoading } = api.bookings.getBookingsByUserId.useQuery(userId);
  const { data: classes } = api.classes.getAllClasses.useQuery();

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getClassDetails = (classId: string) => {
    return classes?.find((c: any) => c.classID === classId);
  };

  // Group bookings by status
  const activeBookings = bookings?.filter((b: any) => 
    b.status.toLowerCase() === "approved" || b.status.toLowerCase() === "pending"
  ) || [];
  
  const pastBookings = bookings?.filter((b: any) => 
    b.status.toLowerCase() === "completed" || 
    b.status.toLowerCase() === "cancelled" || 
    b.status.toLowerCase() === "rejected"
  ) || [];

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
    <div className="container mx-auto py-8 px-4 pt-24">

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
          <span>Loading your bookings...</span>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-8">
          {/* Quick Action Banner */}
          {(!bookings || bookings.length === 0) && (
            <Card className="shadow-card border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
                  <CalendarCheck className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-2">No Bookings Yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start your fitness journey by browsing our available classes and booking your first session
                </p>
                <Button onClick={() => navigate("/classes")} size="lg" variant="athletic">
                  <Calendar className="mr-2 h-5 w-5" />
                  Browse Classes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Active Bookings */}
          {activeBookings.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Active Bookings</h2>
                  <p className="text-sm text-muted-foreground">Your upcoming and pending classes</p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {activeBookings.length} {activeBookings.length === 1 ? 'booking' : 'bookings'}
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeBookings.map((booking: any) => {
                  const classDetails = getClassDetails(booking.classID);
                  return (
                    <Card key={booking.bookingID} className="shadow-card hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight mb-2">
                              {classDetails?.className || "Class"}
                            </CardTitle>
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{classDetails?.trainerName || "Trainer"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{classDetails?.duration || "Duration"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => navigate(`/classes/${booking.classID}`)}
                          >
                            View Class Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold">Past Bookings</h2>
                <p className="text-sm text-muted-foreground">Your booking history</p>
              </div>
              <div className="space-y-3">
                {pastBookings.map((booking: any) => {
                  const classDetails = getClassDetails(booking.classID);
                  return (
                    <Card key={booking.bookingID} className="shadow-card hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">
                                {classDetails?.className || "Class"}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {classDetails?.trainerName || "Trainer"}
                                </span>
                                <span>•</span>
                                <span>
                                  {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(booking.status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/classes/${booking.classID}`)}
                            >
                              View Class
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Browse More Classes CTA */}
          {bookings && bookings.length > 0 && (
            <Card className="shadow-card border-accent/20">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Looking for more classes?</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore our full catalog of fitness classes
                  </p>
                </div>
                <Button onClick={() => navigate("/classes")} variant="athletic">
                  Browse Classes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingView;
