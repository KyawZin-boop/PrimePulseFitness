import { useParams, useNavigate } from "react-router-dom";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  Dumbbell,
  Apple,
  Activity,
  MessageCircle,
  Plus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TrainerClientDetailView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { userCredentials } = useAuth();

  // Get trainer data
  const { data: trainerData } = api.trainers.getTrainerData.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  // Get all clients to find this specific one
  const { data: clients } = api.trainers.getClient.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  const client = clients?.find((c) => c.clientID === clientId);

  // Get client's progress data using their userID
  const { data: progressData } = api.progress.getProgressByUserId.useQuery(
    client?.userID || "",
    { enabled: !!client?.userID }
  );

  if (!client) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading...</p>
      </div>
    );
  }

  // Calculate progress statistics
  const latestProgress = progressData?.[0];
  const oldestProgress = progressData?.[progressData.length - 1];
  const weightChange = latestProgress && oldestProgress 
    ? latestProgress.currentWeight - oldestProgress.currentWeight 
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/trainer/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
      </div>

      {/* Client Profile Header */}
      <Card className="shadow-card mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Photo */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>

            {/* Client Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{client.name}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(client.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate(`/trainer/messages?client=${client.clientID}`)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {client.currentWeight && (
                  <div className="rounded-lg bg-gradient-card p-3">
                    <p className="text-xs text-muted-foreground mb-1">Current Weight</p>
                    <p className="text-2xl font-bold">{client.currentWeight}kg</p>
                  </div>
                )}
                {client.goalWeight && (
                  <div className="rounded-lg bg-gradient-card p-3">
                    <p className="text-xs text-muted-foreground mb-1">Goal Weight</p>
                    <p className="text-2xl font-bold text-accent">{client.goalWeight}kg</p>
                  </div>
                )}
                {weightChange !== 0 && (
                  <div className="rounded-lg bg-gradient-card p-3">
                    <p className="text-xs text-muted-foreground mb-1">Progress</p>
                    <div className="flex items-center gap-2">
                      {weightChange < 0 ? (
                        <TrendingDown className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-red-500" />
                      )}
                      <p className="text-2xl font-bold">
                        {Math.abs(weightChange).toFixed(1)}kg
                      </p>
                    </div>
                  </div>
                )}
                {client.assignedWorkoutPlan && (
                  <div className="rounded-lg bg-gradient-card p-3">
                    <p className="text-xs text-muted-foreground mb-1">Workout Plan</p>
                    <p className="font-semibold truncate">{client.assignedWorkoutPlan}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">
            <Activity className="mr-2 h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="programs">
            <Dumbbell className="mr-2 h-4 w-4" />
            Programs
          </TabsTrigger>
          <TabsTrigger value="diet">
            <Apple className="mr-2 h-4 w-4" />
            Diet Plans
          </TabsTrigger>
          <TabsTrigger value="info">
            <User className="mr-2 h-4 w-4" />
            Info
          </TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Progress History</CardTitle>
                  <CardDescription>Track weight and measurements over time</CardDescription>
                </div>
                <Button
                  onClick={() => navigate(`/trainer/progress?client=${clientId}`)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Progress
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {progressData && progressData.length > 0 ? (
                <div className="space-y-4">
                  {progressData.map((progress: any, index: number) => {
                    const isFemale = client.gender?.toLowerCase() === "female";
                    return (
                      <div
                        key={progress.progressID}
                        className="rounded-lg border bg-gradient-card p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold">
                              {new Date(progress.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            {index === 0 && (
                              <Badge variant="secondary" className="mt-1">Latest</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{progress.currentWeight}kg</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {!isFemale && progress.chest && (
                            <div>
                              <p className="text-muted-foreground">Chest</p>
                              <p className="font-semibold">{progress.chest}cm</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">Waist</p>
                            <p className="font-semibold">{progress.waist}cm</p>
                          </div>
                          {isFemale && progress.hips && (
                            <div>
                              <p className="text-muted-foreground">Hips</p>
                              <p className="font-semibold">{progress.hips}cm</p>
                            </div>
                          )}
                          {!isFemale && progress.arms && (
                            <div>
                              <p className="text-muted-foreground">Arms</p>
                              <p className="font-semibold">{progress.arms}cm</p>
                            </div>
                          )}
                          {!isFemale && progress.thighs && (
                            <div>
                              <p className="text-muted-foreground">Thighs</p>
                              <p className="font-semibold">{progress.thighs}cm</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No progress data recorded yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate(`/trainer/progress?client=${clientId}`)}
                  >
                    Add First Progress Entry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Assigned Programs</CardTitle>
              <CardDescription>Workout programs for this client</CardDescription>
            </CardHeader>
            <CardContent>
              {client.assignedWorkoutPlan ? (
                <div className="rounded-lg border bg-gradient-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                      <Dumbbell className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{client.assignedWorkoutPlan}</h3>
                      <p className="text-sm text-muted-foreground">Current workout program</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/trainer/programs")}
                  >
                    Manage Programs
                  </Button>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No programs assigned yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/trainer/programs")}
                  >
                    Assign Program
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diet Tab */}
        <TabsContent value="diet">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Diet Plans</CardTitle>
              <CardDescription>Nutrition plans for this client</CardDescription>
            </CardHeader>
            <CardContent>
              {client.assignedDietPlan ? (
                <div className="rounded-lg border bg-gradient-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                      <Apple className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{client.assignedDietPlan}</h3>
                      <p className="text-sm text-muted-foreground">Current diet plan</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/trainer/diet-plans")}
                  >
                    Manage Diet Plans
                  </Button>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Apple className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No diet plan assigned yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/trainer/diet-plans")}
                  >
                    Assign Diet Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-gradient-card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-semibold">{client.name}</p>
                  </div>
                  <div className="rounded-lg border bg-gradient-card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold">{client.email}</p>
                  </div>
                  {client.gender && (
                    <div className="rounded-lg border bg-gradient-card p-4">
                      <p className="text-sm text-muted-foreground mb-1">Gender</p>
                      <p className="font-semibold capitalize">{client.gender}</p>
                    </div>
                  )}
                  <div className="rounded-lg border bg-gradient-card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Join Date</p>
                    <p className="font-semibold">
                      {new Date(client.joinedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-gradient-card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Client ID</p>
                    <p className="font-semibold font-mono text-xs">{client.clientID}</p>
                  </div>
                </div>

                {/* Goals Section */}
                {(client.currentWeight || client.goalWeight) && (
                  <div className="rounded-lg border bg-gradient-card p-4 mt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Fitness Goals
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {client.currentWeight && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Starting Weight</p>
                          <p className="text-2xl font-bold">{client.currentWeight}kg</p>
                        </div>
                      )}
                      {client.goalWeight && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Target Weight</p>
                          <p className="text-2xl font-bold text-accent">{client.goalWeight}kg</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerClientDetailView;
