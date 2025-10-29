import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, TrendingUp, User, Calendar, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import useAuth from "@/hooks/useAuth";

const TrainerClientsView = () => {
  const navigate = useNavigate();
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: Boolean(userId),
  });
  const trainerId = trainer?.trainerID ?? "";

  const { data: clients } = api.trainers.getClient.useQuery(trainerId, {
    enabled: Boolean(trainerId),
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">My Clients</h1>
        <p className="text-muted-foreground">
          Manage your active clients and their progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients && clients.map((client) => (
          <Card
            key={client.clientID}
            className="cursor-pointer shadow-card transition hover:shadow-athletic"
            onClick={() => navigate(`/trainer/clients/${client.clientID}`)}
          >
            <CardHeader>
              <div className="mb-4 flex items-start gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                  {/* {client.profilePhoto ? (
                    <img
                      src={client.profilePhoto}
                      alt={client.name}
                      className="h-full w-full object-cover"
                    />
                  ) :  */}
                  
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="truncate">{client.name}</CardTitle>
                  <CardDescription className="truncate">
                    {client.email}
                  </CardDescription>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Joined {new Date(client.joinedDate).toUTCString().slice(0, 16)}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Dumbbell className="h-3 w-3" />
                    Workout Plan
                  </div>
                  <div className="font-semibold truncate">
                    {client.assignedWorkoutPlan || "None"}
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Diet Plan
                  </div>
                  <div className="font-semibold truncate">
                    {client.assignedDietPlan || "None"}
                  </div>
                </div>
              </div>

              {client.currentWeight && client.goalWeight && (
                <div className="rounded-lg border bg-gradient-card p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Progress
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{client.currentWeight}kg</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-semibold text-accent">{client.goalWeight}kg</span>
                  </div>
                </div>
              )}

              {client.assignedDietPlan && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Current Diet: </span>
                  <span className="font-medium">{client.assignedDietPlan}</span>
                </div>
              )}

              {client.assignedWorkoutPlan && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Current Program: </span>
                  <span className="font-medium">{client.assignedWorkoutPlan}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trainer/messages?client=${client.clientID}`);
                  }}
                >
                  <Mail className="mr-1 h-3 w-3" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients && clients.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Clients Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't been assigned any clients yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerClientsView;
