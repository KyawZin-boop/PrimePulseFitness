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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Dumbbell } from "lucide-react";
import { toast } from "sonner";

interface ExerciseDisplay {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restPeriod?: number;
  instructions?: string;
}

interface ProgramDisplay {
  id: string;
  name: string;
  description: string;
  duration: number;
  exercises: ExerciseDisplay[];
  assignedClients?: number;
}

const TrainerProgramsView = () => {
  const [programs, setPrograms] = useState<ProgramDisplay[]>([
    {
      id: "1",
      name: "Beginner Strength Foundation",
      description: "4-week program for building basic strength",
      duration: 4,
      exercises: [
        {
          id: "e1",
          name: "Barbell Squat",
          sets: 3,
          reps: "10",
          restPeriod: 90,
          instructions: "Keep chest up, depth to parallel",
        },
        {
          id: "e2",
          name: "Bench Press",
          sets: 3,
          reps: "8",
          restPeriod: 120,
          instructions: "Control the negative, explode up",
        },
        {
          id: "e3",
          name: "Deadlift",
          sets: 3,
          reps: "5",
          restPeriod: 180,
          instructions: "Neutral spine, drive through heels",
        },
      ],
      assignedClients: 7,
    },
    {
      id: "2",
      name: "Advanced Hypertrophy",
      description: "8-week muscle building program",
      duration: 8,
      exercises: [
        {
          id: "e4",
          name: "Romanian Deadlift",
          sets: 4,
          reps: "12",
          restPeriod: 90,
        },
        {
          id: "e5",
          name: "Overhead Press",
          sets: 4,
          reps: "8",
          restPeriod: 120,
        },
      ],
      assignedClients: 3,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState("");

  const handleCreateProgram = () => {
    if (!newProgramName || !newDescription || !newDuration) {
      toast.error("Please fill in all fields");
      return;
    }

    const newProgram: ProgramDisplay = {
      id: `program-${Date.now()}`,
      name: newProgramName,
      description: newDescription,
      duration: parseInt(newDuration),
      exercises: [],
      assignedClients: 0,
    };

    setPrograms([newProgram, ...programs]);
    toast.success("Program created successfully!");
    setIsDialogOpen(false);
    setNewProgramName("");
    setNewDescription("");
    setNewDuration("");
  };

  const handleDeleteProgram = (programId: string) => {
    setPrograms(programs.filter((p) => p.id !== programId));
    toast.success("Program deleted");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Workout Programs</h1>
          <p className="text-muted-foreground">
            Create and manage training programs for your clients
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Program</DialogTitle>
              <DialogDescription>
                Build a custom workout program for your clients
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="program-name">Program Name *</Label>
                <Input
                  id="program-name"
                  placeholder="e.g., Beginner Strength Foundation"
                  value={newProgramName}
                  onChange={(e) => setNewProgramName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program-description">Description *</Label>
                <Input
                  id="program-description"
                  placeholder="Brief description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 4"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProgram}>Create Program</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {programs.map((program) => (
          <Card key={program.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{program.name}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{program.duration} weeks</span>
                    <span>{program.assignedClients} clients</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteProgram(program.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
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
                      key={exercise.id}
                      className="rounded-lg border bg-secondary/30 p-3"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-medium text-sm">
                          {exercise.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {exercise.sets} x {exercise.reps}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rest: {exercise.restPeriod}s
                      </div>
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
                <Button variant="outline" className="flex-1" size="sm">
                  Add Exercises
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  Assign to Client
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {programs.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Dumbbell className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Programs Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first workout program
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Program
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerProgramsView;
