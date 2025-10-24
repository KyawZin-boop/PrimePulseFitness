import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTrainerById } from "@/api/trainer";
import { ArrowLeft, Mail, Star, Users, DollarSign, Award, Loader2, User } from "lucide-react";

const AdminTrainerProfile: React.FC = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const navigate = useNavigate();

  const trainerQuery = getTrainerById.useQuery(trainerId ?? "");
  const trainer = trainerQuery.data;

  if (trainerQuery.isLoading) {
    return (
      <div className="container mx-auto pt-10 pb-8 px-4">
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (trainerQuery.isError) {
    return (
      <div className="container mx-auto pt-10 pb-8 px-4">
        <div className="flex h-80 flex-col items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground">Failed to load trainer details</p>
          <Button onClick={() => trainerQuery.refetch()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="container mx-auto pt-10 pb-8 px-4">
        <div className="flex h-80 flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-xl font-semibold">Trainer not found</h2>
          <p className="text-muted-foreground text-sm">
            The trainer profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-10 pb-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trainers
        </Button>
        <h1 className="text-heading mb-2">Trainer Profile</h1>
        <p className="text-muted-foreground">
          Detailed information about {trainer.name}
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="shadow-card mb-6">
        <CardContent className="py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Profile Photo */}
            <div className="relative h-32 w-32 overflow-hidden rounded-full border bg-secondary/40 flex-shrink-0">
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

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{trainer.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{trainer.email}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                    <div className="font-semibold">{trainer.rating ?? "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Clients</div>
                    <div className="font-semibold">{trainer.clients ?? 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Session Fee</div>
                    <div className="font-semibold">${trainer.fees ?? "N/A"}</div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                <Badge variant={trainer.activeFlag ? "default" : "destructive"}>
                  {trainer.activeFlag ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Professional Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Primary Specialty
              </div>
              <div className="font-medium">{trainer.specialty || "Not specified"}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Experience
              </div>
              <div className="font-medium">{trainer.experience || "Not specified"}</div>
            </div>

            {trainer.specialties && trainer.specialties.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Specialties
                </div>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {trainer.certifications && trainer.certifications.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Certifications
                </div>
                <div className="flex flex-wrap gap-2">
                  {trainer.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Trainer ID
              </div>
              <div className="font-mono text-sm">{trainer.trainerID}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                User ID
              </div>
              <div className="font-mono text-sm">{trainer.userID || "N/A"}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Created At
              </div>
              <div className="text-sm">
                {trainer.createdAt 
                  ? new Date(trainer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "N/A"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Last Updated
              </div>
              <div className="text-sm">
                {trainer.updatedAt 
                  ? new Date(trainer.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biography */}
      {trainer.description && (
        <Card className="shadow-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Professional Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {trainer.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTrainerProfile;
