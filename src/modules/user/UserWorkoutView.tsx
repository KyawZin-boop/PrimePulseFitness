import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Timer, RotateCcw, ListChecks, Loader2, Clock } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getProgramsByUserId } from "@/api/program";

const UserWorkoutView = () => {
  const { userCredentials } = useAuth();

  // Fetch user's assigned workout plans directly
  const { data: assignedPrograms = [], isLoading } = getProgramsByUserId.useQuery(
    userCredentials?.userId || ""
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!assignedPrograms || assignedPrograms.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="mb-8">
          <h1 className="text-heading mb-2">My Workout Plans</h1>
          <p className="text-muted-foreground">Your personalized training programs</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-6">
              <Dumbbell className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-semibold text-xl mb-2">No Workout Plans Assigned</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              You don't have any workout plans yet. Contact a trainer to get a personalized training program.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8">
        <h1 className="text-heading mb-2">My Workout Plans</h1>
        <p className="text-muted-foreground">Your personalized training programs</p>
      </div>

      <div className="space-y-6">
        {assignedPrograms.map((program) => (
          <Card key={program.workoutPlanID} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{program.name}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">{program.duration} weeks</span>
                  </div>
                  <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                    <ListChecks className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">{program.exercises?.length} Exercises</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Exercises */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Exercise Plan</h3>
                <div className="space-y-4">
                  {program.exercises.map((exercise, index) => (
                    <Card key={exercise.exerciseID} className="bg-secondary/30">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="text-lg font-semibold">{exercise.name}</h4>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                            <Dumbbell className="h-5 w-5 text-accent" />
                            <div>
                              <div className="text-xs text-muted-foreground">Sets</div>
                              <div className="font-semibold">{exercise.sets}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                            <RotateCcw className="h-5 w-5 text-accent" />
                            <div>
                              <div className="text-xs text-muted-foreground">Reps</div>
                              <div className="font-semibold">{exercise.reps}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                            <Timer className="h-5 w-5 text-accent" />
                            <div>
                              <div className="text-xs text-muted-foreground">Rest</div>
                              <div className="font-semibold">{exercise.restPeriod}s</div>
                            </div>
                          </div>
                        </div>

                        {exercise.instructions && (
                          <div className="bg-background p-3 rounded-lg">
                            <div className="text-sm font-medium mb-1">Instructions:</div>
                            <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserWorkoutView;
