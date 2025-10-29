import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  DollarSign,
  MessageCircle,
  Star,
  User,
  Clock,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import ReviewsList from "@/components/ReviewsList";
import ReviewDialog from "@/components/dialogs/ReviewDialog";
import { useState } from "react";

const TrainerDetailView = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const { data: trainer, isLoading } = api.trainers.getTrainerById.useQuery(
    trainerId || ""
  );

  const { data: schedules } = api.schedule.getAvailableSchedulesByTrainerId.useQuery(
    trainerId || "",
    { enabled: !!trainerId }
  );

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast.error("Please login to send messages");
      navigate("/auth/login");
      return;
    }
    if (trainer) {
      navigate(`/messages?trainer=${trainer.userID}`);
      toast.success(`Opening chat with ${trainer.name}`);
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      navigate("/auth/login");
      return;
    }
    setShowReviewDialog(true);
  };

  const handleUserReviewFound = (review: any) => {
    setUserHasReviewed(!!review);
  };

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Group schedules by day
  const schedulesByDay = daysOfWeek.map((day, index) => ({
    day,
    schedules: (schedules || []).filter((s) => s.dayOfWeek === index),
  }));

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">Loading trainer details...</div>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold mb-2">Trainer Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The trainer you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/trainers")}>Back to Trainers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <Button
        variant="ghost"
        onClick={() => navigate("/trainers")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Trainers
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trainer Info Section */}
        <div className="lg:col-span-1">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <div className="h-32 w-32 overflow-hidden rounded-full bg-secondary mb-4">
                  {trainer.imageUrl ? (
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">{trainer.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm font-semibold mb-2">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  {trainer.rating} ({trainer.rating} reviews)
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {trainer.description}
              </p>

              {/* Pricing */}
              <div className="rounded-lg border bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Hourly Rate:
                  </span>
                  <span className="text-xl font-bold text-accent">
                    ${trainer.fees}/hr
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <span className="text-muted-foreground text-sm">Experience:</span>
                  <span className="font-medium">{trainer.experience}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button onClick={handleSendMessage} className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                {!userHasReviewed && (
                  <Button
                    variant="outline"
                    onClick={handleWriteReview}
                    className="w-full"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Write Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Specializations */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trainer.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability Schedule */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Weekly Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedules && schedules.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {schedulesByDay.map(({ day, schedules: daySchedules }) =>
                    daySchedules.length > 0 ? (
                      <div
                        key={day}
                        className="rounded-lg border bg-gradient-card p-4"
                      >
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {day}
                        </h4>
                        <div className="space-y-2">
                          {daySchedules.map((schedule) => (
                            <div
                              key={schedule.scheduleID}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {schedule.startTime} - {schedule.endTime}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                Available
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground">
                    No availability schedule set yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewsList
                targetID={trainer.trainerID}
                targetType="trainer"
                targetName={trainer.name}
                onUserReviewFound={handleUserReviewFound}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      {trainer && (
        <ReviewDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          targetID={trainer.trainerID}
          targetType="trainer"
          targetName={trainer.name}
        />
      )}
    </div>
  );
};

export default TrainerDetailView;
