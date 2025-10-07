import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Review } from "@/types";

const TrainerReviewsView = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      trainerId: "trainer-1",
      clientId: "1",
      clientName: "Alex Johnson",
      rating: 5,
      comment:
        "Excellent trainer! Really helped me improve my form and reach my strength goals. Highly recommend!",
      createdAt: new Date("2025-05-15"),
    },
    {
      id: "2",
      trainerId: "trainer-1",
      clientId: "2",
      clientName: "Sarah Williams",
      rating: 5,
      comment:
        "Great nutrition advice and personalized meal plans. Lost 10 pounds in 6 weeks!",
      createdAt: new Date("2025-05-10"),
      response: "Thank you Sarah! So proud of your progress. Keep it up!",
    },
    {
      id: "3",
      trainerId: "trainer-1",
      clientId: "3",
      clientName: "Mike Chen",
      rating: 4,
      comment:
        "Very knowledgeable and professional. Workouts are challenging but effective.",
      createdAt: new Date("2025-05-05"),
    },
  ]);

  const [responseText, setResponseText] = useState<{ [key: string]: string }>(
    {}
  );

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((r) => r.rating === rating).length
  );

  const handleRespondToReview = (reviewId: string) => {
    const response = responseText[reviewId];
    if (!response || !response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    setReviews(
      reviews.map((r) => (r.id === reviewId ? { ...r, response } : r))
    );

    setResponseText({ ...responseText, [reviewId]: "" });
    toast.success("Response posted!");
  };

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
          View feedback and respond to client reviews
        </p>
      </div>

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
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="shadow-card">
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-card flex items-center justify-center text-lg font-semibold">
                  {review.clientName.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold">{review.clientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {review.createdAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-sm mb-3">{review.comment}</p>

                  {review.response ? (
                    <div className="rounded-lg bg-secondary/50 p-3 border-l-4 border-accent">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">
                        Your Response
                      </div>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Write a response..."
                        value={responseText[review.id] || ""}
                        onChange={(e) =>
                          setResponseText({
                            ...responseText,
                            [review.id]: e.target.value,
                          })
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => handleRespondToReview(review.id)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Respond
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Star className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground text-center">
              Client reviews will appear here once you receive feedback
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerReviewsView;
