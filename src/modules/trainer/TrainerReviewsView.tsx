import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import api from "@/api";
import useAuth from "@/hooks/useAuth";

const TrainerReviewsView = () => {
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: Boolean(userId),
  });
  const trainerId = trainer?.trainerID ?? "";

  // Fetch reviews for the logged-in trainer
  const reviewsQuery = api.reviews.getReviewsByTrainerId.useQuery(trainerId);
  const reviews = reviewsQuery.data ?? [];

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((r) => r.rating === rating).length
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Client Reviews</h1>
        <p className="text-muted-foreground">
          View feedback from your clients
        </p>
      </div>

      {reviewsQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Star className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground text-center">
              Client reviews will appear here once you receive feedback
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Rating Overview */}
          <Card className="shadow-card mb-8">
        <CardContent className="py-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-5xl font-bold mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {reviews.length} reviews
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    {rating} <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  </div>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: `${
                          (ratingDistribution[index] / reviews.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground w-12 text-right">
                    {ratingDistribution[index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => {
          const key = review.reviewID || `${review.userID}-${index}`;
          return (
            <Card key={key} className="shadow-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-xl font-bold text-accent border-2 border-accent/20">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{review.userName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-muted-foreground">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                      <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap break-words">
                        "{review.content}"
                      </p>
                    </div>

                    {review.response && (
                      <div className="mt-4 rounded-lg bg-gradient-to-r from-accent/5 to-accent/10 p-4 border-l-4 border-accent shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                            <span className="text-xs text-white font-semibold">You</span>
                          </div>
                          <span className="text-xs font-semibold text-accent">
                            Your Response
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {review.response}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
};

export default TrainerReviewsView;
