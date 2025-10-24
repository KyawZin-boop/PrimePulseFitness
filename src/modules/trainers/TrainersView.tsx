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
import {
  Award,
  Calendar,
  DollarSign,
  MessageCircle,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import ReviewDialog from "@/components/dialogs/ReviewDialog";
import ReviewsList from "@/components/ReviewsList";
import type { Review } from "@/api/reviews/type";

const TrainersView = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginConfirm, setShowLoginConfirm] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("all");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const { data: trainers } = api.trainers.getAllTrainers.useQuery();

  const allSpecializations = Array.from(
    new Set(trainers?.flatMap((t) => t.specialties))
  );

  const filteredTrainers = trainers?.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      trainer?.specialties.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  const handleBookSession = (trainer: Trainer) => {
    navigate("/bookings");
    toast.success(`Redirecting to book a session with ${trainer.name}`);
  };

  const handleSendMessage = (trainer: Trainer) => {
    if (!isAuthenticated) {
      setShowLoginConfirm(true);
      return;
    }
    navigate(`/messages?trainer=${trainer.userID}`);
    toast.success(`Opening chat with ${trainer.name}`);
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      setShowLoginConfirm(true);
      return;
    }
    setShowReviewDialog(true);
  };

  const handleUserReviewFound = (review: Review | null) => {
    setUserHasReviewed(!!review);
  };

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8">
        <h1 className="text-heading mb-2 text-accent">Our Trainers</h1>
        <p className="text-muted-foreground">
          Meet our certified fitness professionals ready to guide your journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search trainers or specializations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedSpecialization === "all" ? "default" : "outline"}
            onClick={() => setSelectedSpecialization("all")}
          >
            All
          </Button>
          {allSpecializations.map((spec) => (
            <Button
              key={spec}
              size="sm"
              variant={selectedSpecialization === spec ? "default" : "outline"}
              onClick={() => setSelectedSpecialization(spec)}
            >
              {spec}
            </Button>
          ))}
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrainers?.map((trainer) => (
          <Card
            key={trainer.trainerID}
            className="group cursor-pointer shadow-card transition hover:shadow-athletic"
            onClick={() => setSelectedTrainer(trainer)}
          >
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-secondary">
                  {trainer.imageUrl ? (
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {trainer.rating}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {trainer.rating} reviews
                  </p>
                </div>
              </div>
              <CardTitle>{trainer.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {trainer.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {trainer.specialties.slice(0, 3).map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {trainer.experience} years exp.
                </span>
                <span className="font-bold text-accent">
                  ${trainer.fees}/hr
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrainers?.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            No trainers found matching your criteria
          </p>
        </div>
      )}

      {/* Trainer Detail Modal */}
      <Dialog
        open={!!selectedTrainer}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTrainer(null);
            setShowReviewDialog(false);
            setUserHasReviewed(false);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTrainer && (
            <>
              <DialogHeader>
                <div className="mb-4 flex items-start gap-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                    {selectedTrainer.imageUrl ? (
                      <img
                        src={selectedTrainer.imageUrl}
                        alt={selectedTrainer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">
                      {selectedTrainer.name}
                    </DialogTitle>
                    <DialogDescription className="mt-2">
                      {selectedTrainer.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Specializations */}
                <div>
                  <h3 className="mb-2 font-semibold">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <Award className="h-5 w-5 text-accent" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Experience */}
                <div className="rounded-lg border bg-secondary/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">
                      {selectedTrainer.experience} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Hourly Rate:
                    </span>
                    <span className="text-xl font-bold text-accent">
                      ${selectedTrainer.fees}/hr
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBookSession(selectedTrainer)}
                    className="flex-1"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Session
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendMessage(selectedTrainer)}
                    className="flex-1"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
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

                {/* Reviews Section */}
                <div className="border-t pt-6">
                  <h3 className="mb-4 text-lg font-semibold">Reviews</h3>
                  <ReviewsList
                    targetID={selectedTrainer.trainerID}
                    targetType="trainer"
                    targetName={selectedTrainer.name}
                    onUserReviewFound={handleUserReviewFound}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      {selectedTrainer && (
        <ReviewDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          targetID={selectedTrainer.trainerID}
          targetType="trainer"
          targetName={selectedTrainer.name}
        />
      )}

      <Dialog open={showLoginConfirm} onOpenChange={setShowLoginConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to add items to your cart. Would you like
              to login now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                  navigate(
                    `/auth/login`
                  );
                setShowLoginConfirm(false);
              }}
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
    </div>
  );
};

export default TrainersView;

