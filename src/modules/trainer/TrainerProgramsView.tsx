import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { CreateProgramDialog } from "@/components/dialogs/ProgramDialog";
import { AssignProgramDialog } from "@/components/dialogs/AssignProgramDialog";
import type { Program } from "@/api/program/type";

const TrainerProgramsView = () => {
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: Boolean(userId),
  });
  const trainerId = trainer?.trainerID ?? "";

  const programsQuery = api.program.getProgramsByTrainerId.useQuery(trainerId, {
    enabled: Boolean(trainerId),
  });
  const programs = programsQuery.data ?? [];
  const isLoading = programsQuery.isLoading;
  const isError = programsQuery.isError;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [targetProgram, setTargetProgram] = useState<Program | null>(null);

  const deleteProgramMutation = api.program.deleteProgram.useMutation({
    onSuccess: () => {
      toast.success("Program deleted");
      programsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to delete program");
    },
    onSettled: () => {
      setTargetProgram(null);
      setDeleteDialogOpen(false);
    },
  });

  const handleRequestDelete = (program: Program) => {
    if (deleteProgramMutation.isPending) {
      return;
    }

    setTargetProgram(program);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!targetProgram) {
      return;
    }

    deleteProgramMutation.mutate(targetProgram.workoutPlanID);
  };

  const handleCancelDelete = () => {
    if (deleteProgramMutation.isPending) {
      return;
    }

    setDeleteDialogOpen(false);
    setTargetProgram(null);
  };

  const showEmptyState =
    Boolean(trainerId) && !isLoading && !isError && programs.length === 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Workout Programs</h1>
          <p className="text-muted-foreground">
            Create and manage training programs for your clients
          </p>
        </div>
        <CreateProgramDialog
          mode="create"
          trigger={
            <Button disabled={!trainerId}>
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <h3 className="font-semibold">Unable to load programs</h3>
            <p className="text-muted-foreground text-sm">
              Something went wrong while fetching your programs. Please try again.
            </p>
            <Button onClick={() => programsQuery.refetch()} variant="outline" size="sm">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program) => {
              const assignedClients = program.assignedCount ?? 0;
              const isDeletingThisProgram =
                deleteProgramMutation.isPending &&
                targetProgram?.workoutPlanID === program.workoutPlanID;

              return (
                <Card key={program.workoutPlanID} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{program.name}</CardTitle>
                        <CardDescription>{program.description}</CardDescription>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{program.duration} weeks</span>
                          <span>{assignedClients} clients</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRequestDelete(program)}
                        disabled={isDeletingThisProgram}
                      >
                        {isDeletingThisProgram ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {program.exercises.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        <div className="text-sm font-semibold">
                          Exercises ({program.exercises.length})
                        </div>
                        {program.exercises.map((exercise) => (
                          <div
                            key={exercise.exerciseID}
                            className="rounded-lg border bg-secondary/30 p-3"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <div className="font-medium text-sm">{exercise.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {exercise.sets} x {exercise.reps}
                              </div>
                            </div>
                            {typeof exercise.restPeriod === "number" && (
                              <div className="text-xs text-muted-foreground">
                                Rest: {exercise.restPeriod}s
                              </div>
                            )}
                            {exercise.instructions && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {exercise.instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-4 py-8 text-center border-2 border-dashed rounded-lg">
                        <Dumbbell className="h-8 w-8 text-muted-foreground opacity-20 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No exercises added yet
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <CreateProgramDialog
                        mode="edit"
                        program={program}
                        trigger={
                          <Button variant="outline" className="flex-1" size="sm">
                            Edit Program
                          </Button>
                        }
                      />
                      <AssignProgramDialog
                        program={program}
                        trigger={
                          <Button variant="outline" className="flex-1" size="sm">
                            Assign to Client
                          </Button>
                        }
                        disabled={isDeletingThisProgram}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {showEmptyState && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Dumbbell className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="font-semibold mb-2">No Programs Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first workout program
                </p>
                <CreateProgramDialog
                  mode="create"
                  trigger={
                    <Button disabled={!trainerId}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Program
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              {targetProgram
                ? `Are you sure you want to delete "${targetProgram.name}"?`
                : "Are you sure you want to delete this program?"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleteProgramMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteProgramMutation.isPending}
            >
              {deleteProgramMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerProgramsView;
