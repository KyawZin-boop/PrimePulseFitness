import { Star, User, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import type { Review } from "@/api/reviews/type";

interface ReviewsListProps {
  targetID: string;
  targetType: string;
  targetName: string;
  onUserReviewFound?: (review: Review | null) => void;
}

const ReviewsList = ({ targetID, targetType, onUserReviewFound }: ReviewsListProps) => {
  const { userCredentials } = useAuth();
  const queryClient = useQueryClient();

  // Use appropriate API based on target type
  const reviewsQuery = targetType === "class"
    ? api.reviews.getReviewsByClassId.useQuery(targetID)
    : api.reviews.getReviewsByTrainerId.useQuery(targetID);
  
  const reviews = reviewsQuery.data ?? [];

  // Find user's existing review
  const userReview = reviews.find(r => r.userID === userCredentials?.userId);

  // Notify parent component about user's review
  useEffect(() => {
    if (onUserReviewFound) {
      onUserReviewFound(userReview || null);
    }
  }, [userReview, onUserReviewFound]);

  const deleteReviewMutation = api.reviews.deleteReview.useMutation();

  const handleDelete = (reviewID: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReviewMutation.mutate(reviewID, {
        onSuccess: () => {
          toast.success("Review deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["getReviewsByTarget", targetID, targetType],
          });
          queryClient.invalidateQueries({ queryKey: ["getUserReviews"] });
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message ?? "Failed to delete review");
        },
      });
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  if (reviewsQuery.isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reviews Summary */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
          <span className="text-2xl font-bold">{averageRating}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => {
            const isOwner = review.userID === userCredentials?.userId;
            // Use reviewID if available, otherwise use a combination of userID and index
            const key = review.reviewID || `${review.userID}-${index}`;
            
            return (
              <Card key={key} className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{review.userName}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.createdAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      )}
                      {isOwner && review.reviewID && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(review.reviewID!)}
                          disabled={deleteReviewMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
