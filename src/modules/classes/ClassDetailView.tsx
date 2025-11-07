import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, Undo2, Users, Play, Star, Award, VideoOff } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import ReviewsList from "@/components/ReviewsList";
import ReviewDialog from "@/components/dialogs/ReviewDialog";

const ClassDetailView = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const { isAuthenticated, userCredentials } = useAuth();
  const [showLoginConfirm, setShowLoginConfirm] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const { data: gymClass } = api.classes.getGymClassById.useQuery(classId || "");
  
  // Get user's bookings to check if already enrolled
  const { data: userBookings } = api.bookings.getBookingsByUserId.useQuery(
    userCredentials?.userId || ""
  );
  
  // Check if user is already enrolled in this class
  const isAlreadyEnrolled = userBookings?.some(
    (booking: any) => 
      booking.classID === classId && 
      booking.status.toLowerCase() !== "rejected" &&
      booking.status.toLowerCase() !== "cancelled"
  );
  
  const createBookingMutation = api.bookings.createBooking.useMutation({
    onSuccess: () => {
      toast.success("Class booked successfully! Check your bookings to see the details.");
      navigate("/bookings");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to book class. Please try again.");
    },
  });

  const handleReserveSpot = () => {
    if (!isAuthenticated) {
      setShowLoginConfirm(true);
      return;
    }

    if (isAlreadyEnrolled) {
      toast.error("You are already enrolled in this class! Check your bookings.");
      return;
    }

    if (!classId) {
      toast.error("Invalid class selected");
      return;
    }

    createBookingMutation.mutate({
      userID: userCredentials?.userId || "",
      classID: classId,
    });
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      setShowLoginConfirm(true);
      return;
    }
    setShowReviewDialog(true);
  };

  const handleUserReviewFound = (review: any) => {
    setUserHasReviewed(!!review);
  };

  if (!gymClass) {
    return (
      <div className="container mx-auto flex pt-24 min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-heading">Class not found</h1>
        <p className="max-w-lg text-muted-foreground">
          The class you are looking for is no longer available or the link may be incorrect. Please return to the classes overview and try again.
        </p>
        <Button size="lg" onClick={() => navigate("/classes", { replace: true })}>
          Back to Classes
        </Button>
      </div>
    );
  }

  return (
    <section className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-accent/20 via-accent/5 to-background py-20 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 px-0 mb-6 text-muted-foreground hover:text-accent transition"
            onClick={() => navigate(-1)}
          >
            <Undo2 className="h-4 w-4" />
            Back to Classes
          </Button>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                {gymClass.difficulty} Intensity
              </span>
            </div>
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {gymClass.className}
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
              {gymClass.description}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-semibold">{gymClass.trainerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-semibold">{gymClass.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            {/* Tutorial Video Section */}
            <Card className="border-0 shadow-xl overflow-hidden pt-0 pb-0 gap-0">
              <div className="bg-gradient-to-r from-accent/20 to-accent/5 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Play className="h-6 w-6 text-accent" />
                  <h2 className="text-2xl font-bold">Tutorial Video</h2>
                </div>
                <p className="text-sm text-muted-foreground">Learn the fundamentals and proper form</p>
              </div>
              <CardContent className="p-0">
                {gymClass.videoUrl ? (
                  <div className="aspect-video w-full bg-black relative group">
                    <video 
                      controls 
                      className="w-full h-full"
                      poster="/assets/video-poster.jpg"
                    >
                      <source src={gymClass.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-muted/50 to-muted/20 flex flex-col items-center justify-center gap-4 p-8">
                    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground mb-1">No Tutorial Video Available</p>
                      <p className="text-sm text-muted-foreground">
                        Tutorial video coming soon. Join the class to learn from our expert instructor.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBadge 
                icon={<Clock className="h-5 w-5 text-accent" />} 
                label="Duration" 
                value={gymClass.duration} 
              />
              <InfoBadge 
                icon={<Users className="h-5 w-5 text-accent" />} 
                label="Capacity" 
                value={`${gymClass.capacity} people`} 
              />
              <InfoBadge 
                icon={<Calendar className="h-5 w-5 text-accent" />} 
                label="Schedule" 
                value={gymClass.time} 
              />
            </div>

            {/* What to Expect */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">What to Expect</CardTitle>
                <CardDescription>Key highlights of this class experience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {gymClass.highlights.map((highlight, index) => (
                    <li key={highlight} className="flex items-start gap-3 group">
                      <div className="mt-1 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition">
                        <span className="text-xs font-bold text-accent">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
              {isAlreadyEnrolled ? (
                <Button 
                  size="lg" 
                  className="flex-1 text-lg h-14" 
                  variant="outline"
                  onClick={() => navigate("/bookings")}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  View My Bookings
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="flex-1 text-lg h-14" 
                  variant="athletic"
                  onClick={handleReserveSpot}
                  disabled={createBookingMutation.isPending}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  {createBookingMutation.isPending ? "Booking..." : "Reserve Your Spot"}
                </Button>
              )}
              <Button
                size="lg"
                variant="outline_athletic"
                className="flex-1 text-lg h-14"
                onClick={() => navigate("/classes")}
              >
                View All Classes
              </Button>
            </div>

            {/* Reviews Section */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Reviews</CardTitle>
                    <CardDescription>See what others are saying about this class</CardDescription>
                  </div>
                  {!userHasReviewed && (
                    <Button
                      variant="outline"
                      onClick={handleWriteReview}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Write Review
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ReviewsList
                  targetID={gymClass.classID}
                  targetType="class"
                  targetName={gymClass.className}
                  onUserReviewFound={handleUserReviewFound}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-accent/20 shadow-xl sticky top-24 pt-0">
              <CardHeader className="bg-gradient-to-br from-accent/10 to-accent/5 py-3 rounded-t-xl">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Class Snapshot
                </CardTitle>
                <CardDescription>
                  Quick details so you know exactly how to prepare
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <DetailRow label="Intensity Level" value={gymClass.difficulty} highlight />
                <DetailRow
                  label="Lead Instructor"
                  value={`${gymClass.trainerName}`}
                />
                <DetailRow 
                  label="Rating" 
                  value={`★ ${gymClass.rating.toFixed(1)} / 5.0`}
                />
                <div className="h-px bg-border my-4" />
                <DetailRow label="Class Duration" value={gymClass.duration} />
                <DetailRow label="Max Capacity" value={`${gymClass.capacity} participants`} />
                <DetailRow label="Schedule" value={gymClass.time} />
                <div className="pt-4">
                  {isAlreadyEnrolled ? (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      variant="outline"
                      onClick={() => navigate("/bookings")}
                    >
                      Already Enrolled - View Bookings
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      variant="athletic"
                      onClick={handleReserveSpot}
                      disabled={createBookingMutation.isPending}
                    >
                      {createBookingMutation.isPending ? "Booking..." : "Book Now"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Login Confirmation Dialog */}
      <Dialog open={showLoginConfirm} onOpenChange={setShowLoginConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to book classes. Would you like to login now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                navigate(`/auth/login?redirect=/classes/${classId}`);
                setShowLoginConfirm(false);
              }}
              variant="athletic"
            >
              Yes, Login
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowLoginConfirm(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      {gymClass && (
        <ReviewDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          targetID={gymClass.classID}
          targetType="class"
          targetName={gymClass.className}
        />
      )}
    </section>
  );
};

const InfoBadge = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-5 shadow-md transition-all hover:shadow-xl hover:scale-105">
    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {icon}
        {label}
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const DetailRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className={`${highlight ? 'p-3 rounded-lg bg-accent/5 border border-accent/20' : ''}`}>
    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
      {label}
    </p>
    <p className={`text-base font-semibold ${highlight ? 'text-accent' : 'text-foreground'}`}>{value}</p>
  </div>
);

export default ClassDetailView;
