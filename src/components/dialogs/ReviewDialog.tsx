import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import type { Review } from "@/api/reviews/type";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetID: string;
  targetType: string;
  targetName: string;
  existingReview?: Review | null;
}

const ReviewDialog = ({
  open,
  onOpenChange,
  targetID,
  targetType,
  targetName,
  existingReview,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [content, setContent] = useState(existingReview?.content ?? "");
  const [hoveredRating, setHoveredRating] = useState(0);
  const queryClient = useQueryClient();
  const { userCredentials } = useAuth();

  const addReviewMutation = api.reviews.addReview.useMutation();
  const updateReviewMutation = api.reviews.updateReview.useMutation();

  const resetForm = () => {
    if (!existingReview) {
      setRating(5);
      setContent("");
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("Please write a comment");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating");
      return;
    }

    if (existingReview && existingReview.reviewID) {
      updateReviewMutation.mutate(
        {
          reviewID: existingReview.reviewID,
          userID: userCredentials?.userId || "",
          rating,
          content: content.trim(),
        },
        {
          onSuccess: () => {
            toast.success("Review updated successfully!");
            // Invalidate reviews queries to refetch
            if (targetType === "trainer") {
              queryClient.invalidateQueries({ queryKey: ["getReviewsByTrainerId", targetID] });
              queryClient.invalidateQueries({ queryKey: ["getAllTrainers"] });
            } else if (targetType === "class") {
              queryClient.invalidateQueries({ queryKey: ["getReviewsByClassId", targetID] });
              queryClient.invalidateQueries({ queryKey: ["getAllGymClasses"] });
            }
            queryClient.invalidateQueries({ queryKey: ["getUserReviews"] });
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message ?? "Failed to update review");
          },
        }
      );
    } else {
      addReviewMutation.mutate(
        {
          userID: userCredentials?.userId || "",
          receiverID: targetID,
          type: targetType,
          rating,
          content: content.trim(),
        },
        {
          onSuccess: () => {
            toast.success("Review submitted successfully!");
            // Invalidate reviews queries to refetch
            if (targetType === "trainer") {
              queryClient.invalidateQueries({ queryKey: ["getReviewsByTrainerId", targetID] });
              queryClient.invalidateQueries({ queryKey: ["getAllTrainers"] });
            } else if (targetType === "class") {
              queryClient.invalidateQueries({ queryKey: ["getReviewsByClassId", targetID] });
              queryClient.invalidateQueries({ queryKey: ["getAllGymClasses"] });
            }
            queryClient.invalidateQueries({ queryKey: ["getUserReviews"] });
            onOpenChange(false);
            resetForm();
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message ?? "Failed to submit review");
          },
        }
      );
    }
  };

  const isLoading = addReviewMutation.isPending || updateReviewMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Edit Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with {targetName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center">
                {rating} / 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Review *</Label>
            <Textarea
              id="content"
              rows={5}
              placeholder="Share details about your experience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {content.length} / 500 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : existingReview ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
