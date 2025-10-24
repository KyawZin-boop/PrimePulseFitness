import { ReactNode, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import type { Program } from "@/api/program/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ProgramDialogMode = "create" | "edit";

type ExerciseForm = {
  id: string;
  exerciseID?: string;
  name: string;
  sets: string;
  reps: string;
  restPeriod: string;
  instructions: string;
};

type CreateProgramDialogProps = {
  mode: ProgramDialogMode;
  program?: Program;
  trigger?: ReactNode;
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
};

const createEmptyExercise = (): ExerciseForm => ({
  id: generateId(),
  name: "",
  sets: "",
  reps: "",
  restPeriod: "",
  instructions: "",
});

const toExerciseForm = (exercise: Program["exercises"][number]): ExerciseForm => ({
  id: generateId(),
  exerciseID: exercise.exerciseID,
  name: exercise.name ?? "",
  sets: String(exercise.sets ?? ""),
  reps: String(exercise.reps ?? ""),
  restPeriod: String(exercise.restPeriod ?? ""),
  instructions: exercise.instructions ?? "",
});

export const CreateProgramDialog = ({
  mode,
  program,
  trigger,
}: CreateProgramDialogProps) => {
  const isEdit = mode === "edit";

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState<ExerciseForm[]>([]);

  const queryClient = useQueryClient();
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const shouldFetchTrainer = !isEdit && Boolean(userId);
  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: shouldFetchTrainer,
  });

  const trainerId = useMemo(() => {
    if (isEdit) {
      return program?.trainerID ?? "";
    }

    return trainer?.trainerID ?? "";
  }, [isEdit, program, trainer]);

  const createProgramMutation = api.program.createProgram.useMutation({
    onSuccess: () => {
      toast.success("Program created successfully");
      invalidateProgramsQuery();
      closeDialog();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to create program");
    },
  });

  const updateProgramMutation = api.program.updateProgram.useMutation({
    onSuccess: () => {
      toast.success("Program updated successfully");
      invalidateProgramsQuery();
      closeDialog();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to update program");
    },
  });

  const isSubmitting = createProgramMutation.isPending || updateProgramMutation.isPending;

  const resetForm = () => {
    setName("");
    setDescription("");
    setDuration("");
    setExercises([]);
  };

  const hydrateFromProgram = () => {
    if (!program) {
      return;
    }

    setName(program.name ?? "");
    setDescription(program.description ?? "");
    setDuration(program.duration ? String(program.duration) : "");
    setExercises(program.exercises?.map(toExerciseForm) ?? []);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
      return;
    }

    if (isEdit) {
      hydrateFromProgram();
      return;
    }

    resetForm();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEdit) {
      hydrateFromProgram();
    }
  }, [open, isEdit, program]);

  const handleExerciseChange = (
    exerciseId: string,
    field: keyof Omit<ExerciseForm, "id" | "exerciseID">,
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise
      )
    );
  };

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, createEmptyExercise()]);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId));
  };

  const parseNumber = (value: string, allowZero = false) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return NaN;
    }

    const parsed = Number(trimmed);

    if (Number.isNaN(parsed)) {
      return NaN;
    }

    if (!allowZero && parsed <= 0) {
      return NaN;
    }

    if (allowZero && parsed < 0) {
      return NaN;
    }

    return parsed;
  };

  const handleSubmit = () => {
    if (!name.trim() || !description.trim() || !duration.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!trainerId) {
      toast.error("You must complete your trainer profile before managing programs.");
      return;
    }

    const parsedDuration = parseNumber(duration);

    if (Number.isNaN(parsedDuration)) {
      toast.error("Duration must be a positive number");
      return;
    }

    if (exercises.length === 0) {
      toast.error("Add at least one exercise to the program");
      return;
    }

    let exerciseHasError = false;

    const normalizedExercises = exercises.map((exercise) => {
      const sets = parseNumber(exercise.sets);
      const reps = parseNumber(exercise.reps);
      const restPeriod = exercise.restPeriod.trim()
        ? parseNumber(exercise.restPeriod, true)
        : 0;

      if (
        !exercise.name.trim() ||
        Number.isNaN(sets) ||
        Number.isNaN(reps) ||
        Number.isNaN(restPeriod)
      ) {
        exerciseHasError = true;
      }

      return {
        exerciseID: exercise.exerciseID,
        name: exercise.name.trim(),
        sets,
        reps,
        restPeriod,
        instructions: exercise.instructions.trim() || null,
      };
    });

    if (exerciseHasError) {
      toast.error("Ensure all exercises include a name, sets, reps, and valid numbers");
      return;
    }

    const basePayload = {
      trainerID: trainerId,
      name: name.trim(),
      description: description.trim(),
      duration: parsedDuration,
    };

    if (isEdit) {
      if (!program) {
        toast.error("Unable to edit this program");
        return;
      }

      updateProgramMutation.mutate({
        workoutPlanID: program.workoutPlanID,
        ...basePayload,
        exercises: normalizedExercises,
      });
      return;
    }

    createProgramMutation.mutate({
      ...basePayload,
      exercises: normalizedExercises.map(({ exerciseID, ...rest }) => rest),
    });
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const invalidateProgramsQuery = () => {
    if (!trainerId) {
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ["getProgramsByTrainerId", trainerId],
    });
  };

  const actionLabel = isEdit ? "Save Changes" : "Create Program";
  const title = isEdit ? "Edit Program" : "Create New Program";
  const descriptionLabel = isEdit
    ? "Update the program details and exercises."
    : "Design a workout program for your clients.";

  const renderedTrigger = trigger ?? (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      {isEdit ? "Edit Program" : "Create Program"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{renderedTrigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{descriptionLabel}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="program-name">Program Name *</Label>
              <Input
                id="program-name"
                placeholder="e.g., Beginner Strength Foundation"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-duration">Duration (weeks) *</Label>
              <Input
                id="program-duration"
                type="number"
                min="1"
                placeholder="e.g., 4"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="program-description">Description *</Label>
            <Textarea
              id="program-description"
              placeholder="Outline the focus or structure of this program"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Exercises</h3>
                <p className="text-xs text-muted-foreground">
                  Add exercises with their sets, reps, and rest periods.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddExercise}>
                <Plus className="mr-1 h-4 w-4" /> Add Exercise
              </Button>
            </div>

            {exercises.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No exercises added yet. Click "Add Exercise" to begin building the program.
              </div>
            ) : (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="rounded-lg border bg-secondary/30 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-semibold">Exercise {index + 1}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(exercise.id)}
                        aria-label="Remove exercise"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-name-${exercise.id}`}>Name *</Label>
                        <Input
                          id={`exercise-name-${exercise.id}`}
                          placeholder="e.g., Barbell Squat"
                          value={exercise.name}
                          onChange={(event) =>
                            handleExerciseChange(exercise.id, "name", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-sets-${exercise.id}`}>Sets *</Label>
                        <Input
                          id={`exercise-sets-${exercise.id}`}
                          type="number"
                          min="1"
                          placeholder="e.g., 3"
                          value={exercise.sets}
                          onChange={(event) =>
                            handleExerciseChange(exercise.id, "sets", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-reps-${exercise.id}`}>Reps *</Label>
                        <Input
                          id={`exercise-reps-${exercise.id}`}
                          type="number"
                          min="1"
                          placeholder="e.g., 10"
                          value={exercise.reps}
                          onChange={(event) =>
                            handleExerciseChange(exercise.id, "reps", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-rest-${exercise.id}`}>
                          Rest Period (seconds)
                        </Label>
                        <Input
                          id={`exercise-rest-${exercise.id}`}
                          type="number"
                          min="0"
                          placeholder="e.g., 90"
                          value={exercise.restPeriod}
                          onChange={(event) =>
                            handleExerciseChange(exercise.id, "restPeriod", event.target.value)
                          }
                        />
                      </div>
                      <div className="md:col-span-2 lg:col-span-3 space-y-2">
                        <Label htmlFor={`exercise-instructions-${exercise.id}`}>
                          Instructions
                        </Label>
                        <Textarea
                          id={`exercise-instructions-${exercise.id}`}
                          placeholder="Helpful cues or tips"
                          value={exercise.instructions}
                          onChange={(event) =>
                            handleExerciseChange(exercise.id, "instructions", event.target.value)
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              actionLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
