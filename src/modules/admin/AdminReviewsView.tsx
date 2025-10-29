import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, MessageSquare, MoreVertical, Flag, Loader2, MessageCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import { useQueryClient } from "@tanstack/react-query";

const AdminReviewsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const queryClient = useQueryClient();

  // Fetch all reviews using getUserReviews
  const { data: reviews = [], isLoading } = api.reviews.getUserReviews.useQuery();
  const deleteReviewMutation = api.reviews.deleteReview.useMutation();

  const handleFlagReview = (reviewId: string) => {
    toast.warning(`Review ${reviewId} has been flagged for moderation`);
  };

  const handleHideReview = (reviewId: string) => {
    toast.success(`Review ${reviewId} has been hidden`);
  };

  const handlePublishReview = (reviewId: string) => {
    toast.success(`Review ${reviewId} has been published`);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (!reviewId) {
      toast.error("Invalid review ID");
      return;
    }

    if (confirm("Are you sure you want to delete this review?")) {
      deleteReviewMutation.mutate(reviewId, {
        onSuccess: () => {
          toast.success("Review deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["getUserReviews"] });
          queryClient.invalidateQueries({ queryKey: ["getAllTrainers"] });
          queryClient.invalidateQueries({ queryKey: ["getAllGymClasses"] });
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message ?? "Failed to delete review");
        },
      });
    }
  };

  const filteredReviews = reviews.filter(
    (review) => {
      // Type filter
      if (typeFilter !== "all" && review.type !== typeFilter) return false;
      // Search filter
      return (
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.receiverName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  const stats = {
    total: reviews.length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0",
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Reviews & Feedback</h1>
        <p className="text-muted-foreground">Moderate user reviews and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="shadow-card border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Reviews
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</h3>
                  <span className="text-sm text-muted-foreground">reviews</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50/50 to-transparent dark:from-yellow-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Average Rating
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{stats.avgRating}</h3>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.round(parseFloat(stats.avgRating))
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">out of 5</span>
                  </div>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 bg-secondary/50 rounded-lg p-2 shadow-sm">
          <Button
            variant={typeFilter === "all" ? "default" : "ghost"}
            size="sm"
            className={typeFilter === "all" ? "font-bold" : ""}
            onClick={() => setTypeFilter("all")}
          >
            All
          </Button>
          <Button
            variant={typeFilter === "trainer" ? "default" : "ghost"}
            size="sm"
            className={typeFilter === "trainer" ? "font-bold" : ""}
            onClick={() => setTypeFilter("trainer")}
          >
            Trainer
          </Button>
          <Button
            variant={typeFilter === "class" ? "default" : "ghost"}
            size="sm"
            className={typeFilter === "class" ? "font-bold" : ""}
            onClick={() => setTypeFilter("class")}
          >
            Class
          </Button>
        </div>
        <div className="relative w-full md:w-[340px]">
          <Input
            placeholder="Search reviews by user, trainer/class, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-input shadow-sm focus:ring-accent"
          />
          <span className="absolute left-3 top-2.5 text-muted-foreground">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="8" cy="8" r="7"/><line x1="16" y1="16" x2="12" y2="12"/></svg>
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all" ? "No reviews found matching your criteria" : "No reviews yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.reviewID} className="shadow-card border border-muted rounded-xl hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400 drop-shadow" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-base text-accent">{review.userName}</span>
                        <span className="text-muted-foreground"></span>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary/40 text-muted-foreground font-medium">
                          {review.type === "trainer" ? "Trainer" : "Class"}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {review.receiverName || "Unknown"}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-2 text-[15px] leading-relaxed border-l-4 border-accent pl-3 bg-secondary/10 rounded">
                        {review.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        {review.createdAt && (
                          <span className="bg-secondary/30 px-2 py-1 rounded">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {review.type}
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleFlagReview(review.reviewID || "")}>
                          <Flag className="mr-2 h-4 w-4" />
                          Flag Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHideReview(review.reviewID || "")}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Hide Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePublishReview(review.reviewID || "")}>
                          <Star className="mr-2 h-4 w-4" />
                          Publish Review
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteReview(review.reviewID || "")}
                          className="text-red-600"
                          disabled={deleteReviewMutation.isPending}
                        >
                          Delete Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsView;
