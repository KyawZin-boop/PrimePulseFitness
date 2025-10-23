import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTrainerById } from "@/api/trainer";

const AdminTrainerProfile: React.FC = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const navigate = useNavigate();

  const trainerQuery = getTrainerById.useQuery(trainerId ?? "");
  const trainer = trainerQuery.data;

  return (
    <div className="container mx-auto pt-20 pb-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-heading">Trainer Profile</h1>
          <p className="text-muted-foreground">
            Trainer details and statistics
          </p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{trainer?.name ?? trainerId}</CardTitle>
        </CardHeader>
        <CardContent>
          {trainerQuery.isLoading && <div>Loading trainer...</div>}
          {trainerQuery.isError && (
            <div className="text-destructive">Failed to load trainer</div>
          )}

          {trainer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{trainer.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Specialty</div>
                  <div className="font-medium">
                    {trainer.specialty ??
                      (trainer.specialties || []).join(", ")}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">About</div>
                <div className="mt-2">{trainer.description ?? "-"}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">Clients</div>
                  <div className="font-medium">{trainer.clients ?? 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                  <div className="font-medium">{trainer.rating ?? "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Fees</div>
                  <div className="font-medium">{trainer.fees ?? "-"}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTrainerProfile;
