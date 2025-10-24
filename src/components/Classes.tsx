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
import { Clock, Users, Calendar, Star } from "lucide-react";
import { useState } from "react";
import api from "@/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ReviewDialog from "@/components/dialogs/ReviewDialog";
import ReviewsList from "@/components/ReviewsList";
import type { Review } from "@/api/reviews/type";

type SelectedSlot = {
  classId: string;
  className: string;
  trainerName: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  duration: string;
  price: number;
  isFree: boolean;
};

const Classes = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userCredentials } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedClassForDetails, setSelectedClassForDetails] = useState<GymClass | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const { data: gymClasses } = api.classes.getPopularClasses.useQuery();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const handleBookClass = (classItem: GymClass) => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    } else {
      const mockSlot: SelectedSlot = {
        classId: classItem.classID,
        className: classItem.className,
        trainerName: classItem.trainerName,
        date: new Date(), // Mock current date; in real app, select from available dates
        startTime: "10:00 AM", // Mock; parse from classItem.time if possible
        endTime: "11:00 AM",
        location: "Main Studio",
        duration: classItem.duration,
        price: 50, // Mock price
        isFree: false,
      };
      setSelectedSlot(mockSlot);
      setShowConfirmModal(true);
    }
  };

  const { mutate: bookingMutation, isPending: bookingPending } =
    api.bookings.createBooking.useMutation({
      onSuccess: () => {
        toast.success("Booking successful! Waiting for approval.");
      },

      onError: () => {
        toast.error("Failed to book class. Please try again.");
      },
    });

  const handleBooking = () => {
    if (selectedSlot) {
      const payload = {
        userID: userCredentials?.userId || "",
        classID: selectedSlot.classId,
      };
      bookingMutation(payload);
    }
    setShowConfirmModal(false);
    setSelectedSlot(null);
  };

  const handleWriteReview = (classItem: GymClass) => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    setSelectedClassForDetails(classItem);
    setShowReviewDialog(true);
  };

  const handleUserReviewFound = (review: Review | null) => {
    setUserHasReviewed(!!review);
  };

  const handleViewDetails = (classItem: GymClass) => {
    setSelectedClassForDetails(classItem);
  };

  return (
    <section id="classes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-heading mb-4">Expert-Led Classes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our diverse range of fitness classes led by certified trainers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {gymClasses &&
            gymClasses.map((classItem: GymClass) => (
              <Card
                key={classItem.classID}
                className="bg-gradient-card border-0 shadow-card hover:shadow-athletic transition-athletic group"
              >
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <CardTitle className="text-xl font-bold mb-2">
                        {classItem.className}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          with {classItem.trainerName}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="text-sm font-medium">
                            {classItem.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(
                        classItem.difficulty
                      )}`}
                    >
                      {classItem.difficulty}
                    </span>
                  </div>

                  <CardDescription className="text-sm leading-relaxed">
                    {classItem.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-accent" />
                      {classItem.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-accent" />
                      {classItem.capacity}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span className="text-xs">{classItem.time}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="athletic"
                      className="flex-1"
                      onClick={() => handleBookClass(classItem)}
                    >
                      Book Class
                    </Button>
                    <Button
                      variant="outline_athletic"
                      onClick={() => handleViewDetails(classItem)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="xl">
            View Full Schedule
          </Button>
        </div>
      </div>

      {/* Booking Confirmation Dialog */}
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

      {/* Class Details Dialog with Reviews */}
      <Dialog
        open={!!selectedClassForDetails}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedClassForDetails(null);
            setShowReviewDialog(false);
            setUserHasReviewed(false);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedClassForDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedClassForDetails.className}
                </DialogTitle>
                <DialogDescription>
                  Led by {selectedClassForDetails.trainerName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Class Info */}
                <div>
                  <h3 className="font-semibold mb-3">About this class</h3>
                  <p className="text-muted-foreground">
                    {selectedClassForDetails.description}
                  </p>
                </div>

                {/* Class Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">{selectedClassForDetails.duration}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Capacity</div>
                    <div className="font-medium">{selectedClassForDetails.capacity} people</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Difficulty</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(selectedClassForDetails.difficulty)}`}>
                      {selectedClassForDetails.difficulty}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Schedule</div>
                    <div className="font-medium text-sm">{selectedClassForDetails.time}</div>
                  </div>
                </div>

                {/* Highlights */}
                {selectedClassForDetails.highlights && selectedClassForDetails.highlights.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Class Highlights</h3>
                    <ul className="space-y-2">
                      {selectedClassForDetails.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Star className="h-4 w-4 text-accent mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBookClass(selectedClassForDetails)}
                    className="flex-1"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book This Class
                  </Button>
                  {!userHasReviewed && (
                    <Button
                      variant="outline"
                      onClick={() => handleWriteReview(selectedClassForDetails)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Write Review
                    </Button>
                  )}
                </div>

                {/* Reviews Section */}
                <div className="border-t pt-6">
                  <h3 className="mb-4 text-lg font-semibold">Reviews</h3>
                  <ReviewsList
                    targetID={selectedClassForDetails.classID}
                    targetType="class"
                    targetName={selectedClassForDetails.className}
                    onUserReviewFound={handleUserReviewFound}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      {selectedClassForDetails && (
        <ReviewDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          targetID={selectedClassForDetails.classID}
          targetType="class"
          targetName={selectedClassForDetails.className}
        />
      )}
    </section>
  );
};

export default Classes;
