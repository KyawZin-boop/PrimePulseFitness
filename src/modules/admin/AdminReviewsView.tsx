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
import { Star, MessageSquare, MoreVertical, Flag } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  user: string;
  trainer: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "flagged" | "hidden";
}

const AdminReviewsView = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const reviews: Review[] = [
    {
      id: "1",
      user: "John Doe",
      trainer: "Mike Johnson",
      rating: 5,
      comment: "Excellent trainer! Very knowledgeable and motivating.",
      date: "2024-01-15",
      status: "published",
    },
    {
      id: "2",
      user: "Sarah Smith",
      trainer: "Emily Davis",
      rating: 4,
      comment: "Great sessions, but sometimes late to appointments.",
      date: "2024-01-14",
      status: "published",
    },
    {
      id: "3",
      user: "Mike Wilson",
      trainer: "Mike Johnson",
      rating: 1,
      comment: "Inappropriate language during session. Very unprofessional.",
      date: "2024-01-13",
      status: "flagged",
    },
    {
      id: "4",
      user: "Emma Johnson",
      trainer: "David Lee",
      rating: 5,
      comment: "Amazing results! Lost 15 pounds in 2 months.",
      date: "2024-01-12",
      status: "published",
    },
    {
      id: "5",
      user: "Alex Brown",
      trainer: "Emily Davis",
      rating: 3,
      comment: "Decent trainer but nothing special.",
      date: "2024-01-11",
      status: "hidden",
    },
  ];

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
    toast.success(`Review ${reviewId} has been deleted`);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: reviews.length,
    published: reviews.filter((r) => r.status === "published").length,
    flagged: reviews.filter((r) => r.status === "flagged").length,
    avgRating: (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1),
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Reviews & Feedback</h1>
        <p className="text-muted-foreground">Moderate user reviews and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.published}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Flagged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.flagged}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}/5</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search reviews by user, trainer, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card
            key={review.id}
            className={`shadow-card ${
              review.status === "flagged" ? "border-red-500 border-2" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{review.user}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">
                      Trainer: {review.trainer}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-2">{review.comment}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{review.date}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.status === "published"
                          ? "bg-green-100 text-green-700"
                          : review.status === "flagged"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleFlagReview(review.id)}
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Flag Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleHideReview(review.id)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Hide Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePublishReview(review.id)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Publish Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600"
                    >
                      Delete Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReviewsView;
