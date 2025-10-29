import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, DollarSign, User, Clock, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { getAllBookings } from "@/api/bookings";
import { getAllClasses } from "@/api/classes";
import { getAllUsers } from "@/api/user";

const AdminBookingsView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all data
  const bookingsQuery = getAllBookings.useQuery();
  const classesQuery = getAllClasses.useQuery();
  const usersQuery = getAllUsers.useQuery();

  const bookings = bookingsQuery.data || [];
  const classes = classesQuery.data || [];
  const users = usersQuery.data || [];

  // Create lookup maps for better performance
  const classMap = new Map(classes.map(c => [c.classID, c]));
  const userMap = new Map(users.map(u => [u.userID, u]));

  // Enrich bookings with class and user data
  const enrichedBookings = bookings.map(booking => {
    const classData = classMap.get(booking.classID);
    const userData = userMap.get(booking.userID);
    
    return {
      ...booking,
      className: classData?.className || "Unknown Class",
      classPrice: classData?.price || 0,
      classDuration: classData?.duration || 0,
      classTime: classData?.time || "",
      userName: userData?.name || "Unknown User",
      userEmail: userData?.email || "",
    };
  });

  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.activeFlag && b.status.toLowerCase() === "approved").length,
    pending: bookings.filter((b) => b.activeFlag && b.status.toLowerCase() === "pending").length,
    cancelled: bookings.filter((b) => !b.activeFlag || b.status.toLowerCase() === "rejected").length,
  };

  const filteredBookings = enrichedBookings.filter((b) =>
    b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string, activeFlag: boolean) => {
    if (!activeFlag || status.toLowerCase() === "rejected") {
      return "bg-red-500/10 text-red-600";
    }
    if (status.toLowerCase() === "approved") {
      return "bg-green-500/10 text-green-600";
    }
    if (status.toLowerCase() === "pending") {
      return "bg-yellow-500/10 text-yellow-600";
    }
    return "bg-gray-500/10 text-gray-600";
  };

  const getStatusText = (status: string, activeFlag: boolean) => {
    if (!activeFlag) return "Cancelled";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

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
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active</p>
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
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user name, email, or class name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Bookings List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {(bookingsQuery.isLoading || classesQuery.isLoading || usersQuery.isLoading) && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
              <span>Loading bookings...</span>
            </div>
          )}

          {(bookingsQuery.isError || classesQuery.isError || usersQuery.isError) && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <p className="text-red-600">Failed to load bookings. Please try again.</p>
            </div>
          )}

          {!bookingsQuery.isLoading && !classesQuery.isLoading && !usersQuery.isLoading && 
           !bookingsQuery.isError && !classesQuery.isError && !usersQuery.isError && (
            <>
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No bookings found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.bookingID}
                      className="flex items-center justify-between rounded-lg border bg-gradient-card p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{booking.userName}</span>
                          <Badge className={getStatusColor(booking.status, booking.activeFlag)}>
                            {getStatusText(booking.status, booking.activeFlag)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <span className="text-gray-600">{booking.userEmail}</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4 flex-wrap">
                          <span className="font-medium text-gray-900">{booking.className}</span>
                          {booking.classTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {booking.classTime}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(booking.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {booking.classPrice > 0 && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${booking.classPrice}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Booking ID: {booking.bookingID.slice(0, 8)}... • 
                          Updated: {new Date(booking.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookingsView;
