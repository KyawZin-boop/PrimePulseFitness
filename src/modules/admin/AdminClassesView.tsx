import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash2, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getAllClasses,
  addNewClass,
  updateClass,
  deleteClass,
} from "@/api/classes";
import { getAllTrainers } from "@/api/trainer";
import { useQueryClient } from "@tanstack/react-query";

const AdminClassesView = () => {
  const queryClient = useQueryClient();
  const classesQuery = getAllClasses.useQuery();
  const trainersQuery = getAllTrainers.useQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [newPrice, setNewPrice] = useState("0");
  // Fields aligned with AddGymClass API
  const [newTrainerId, setNewTrainerId] = useState("");
  const [newDuration, setNewDuration] = useState("60");
  const [newTime, setNewTime] = useState("To be scheduled");
  const [newDifficulty, setNewDifficulty] = useState<
    "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  >("Beginner");
  const [newRating, setNewRating] = useState<number>(0);
  const [newHighlights, setNewHighlights] = useState("");

  const addClassMutation = addNewClass.useMutation({
    onSuccess: () => {
      toast.success("Class created successfully!");
      queryClient.invalidateQueries({ queryKey: ["getAllClasses"] });
      setIsDialogOpen(false);
      setNewClassName("");
      setNewDescription("");
      setNewCapacity("");
      setNewTrainerId("");
      setNewDuration("60");
      setNewTime("To be scheduled");
      setNewDifficulty("Beginner");
      setNewRating(0);
      setNewHighlights("");
    },
    onError: () => toast.error("Failed to create class"),
  });
  const navigate = useNavigate();

  const updateClassMutation = updateClass.useMutation({
    onSuccess: () => {
      toast.success("Class updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["getAllClasses"] });
      setIsEditOpen(false);
      setEditingClass(null);
    },
    onError: () => toast.error("Failed to update class"),
  });

  const deleteClassMutation = deleteClass.useMutation({
    onSuccess: () => {
      toast.success("Class deleted");
      queryClient.invalidateQueries({ queryKey: ["getAllClasses"] });
    },
    onError: () => toast.error("Failed to delete class"),
  });

  const handleCreateClass = () => {
    if (!newClassName || !newDescription || !newCapacity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload: AddGymClass = {
      trainerID: newTrainerId || "",
      className: newClassName,
      duration: Number(newDuration),
      price: Number(newPrice),
      difficulty: newDifficulty,
      description: newDescription,
      highlights: newHighlights
        ? newHighlights
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      time: newTime,
      capacity: Number(newCapacity),
      rating: Number(newRating),
    };

    addClassMutation.mutate(payload);
  };

  const handleDeleteClass = (classId: string) => {
    // open modal confirmation
    setDeleteTarget(classId);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteClassMutation.mutate(deleteTarget, {
      onSettled: () => {
        setIsDeleteOpen(false);
        setDeleteTarget(null);
      },
    });
  };

  const openEditDialog = (c: GymClass) => {
    setEditingClass(c);
    // populate form fields
    setNewClassName(c.className || "");
    setNewDescription(c.description || "");
    setNewCapacity(String(c.capacity || 0));
    setNewPrice(String(c.price ?? 0));
    setNewTrainerId(c.trainerID || "");
    setNewDuration(String(c.duration || "60"));
    setNewTime(c.time || "");
    setNewDifficulty(c.difficulty || "Beginner");
    setNewRating(c.rating || 0);
    setNewHighlights((c.highlights || []).join(", "));
    setIsEditOpen(true);
  };

  const handleUpdateClass = () => {
    if (!editingClass) return;
    const payload: UpdateClassDTO = {
      classID: editingClass.classID,
      trainerID: newTrainerId || "",
      className: newClassName,
      duration: Number(newDuration),
      price: Number(newPrice),
      difficulty: newDifficulty,
      description: newDescription,
      highlights: newHighlights
        ? newHighlights
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      time: newTime,
      capacity: Number(newCapacity),
      assignedCount: editingClass.assignedCount ?? 0,
      rating: Number(newRating),
    };

    updateClassMutation.mutate(payload);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Class Management</h1>
          <p className="text-muted-foreground">
            Create and manage fitness classes
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Add a new fitness class to the schedule
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="class-name">Class Name *</Label>
                <Input
                  id="class-name"
                  placeholder="e.g., HIIT Cardio Blast"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainer">Trainer</Label>
                <Select
                  value={newTrainerId}
                  onValueChange={(val) => setNewTrainerId(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {(trainersQuery.data || []).map((t: Trainer) => (
                      <SelectItem key={t.trainerID} value={t.trainerID}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="20"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="25"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    placeholder="e.g., Mon 6:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={newDifficulty}
                    onValueChange={(val) => setNewDifficulty(val as any)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="All Levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    placeholder="0"
                    value={String(newRating)}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlights">Highlights (comma separated)</Label>
                <Input
                  id="highlights"
                  placeholder="e.g., Cardio, Strength, Fat burn"
                  value={newHighlights}
                  onChange={(e) => setNewHighlights(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClass}>Create Class</Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Class</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete this class? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteTarget(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
              <DialogDescription>Update class details</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Class Name *</Label>
                <Input
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Trainer</Label>
                <Select
                  value={newTrainerId}
                  onValueChange={(val) => setNewTrainerId(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {(trainersQuery.data || []).map((t: Trainer) => (
                      <SelectItem key={t.trainerID} value={t.trainerID}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Duration (mins)</Label>
                  <Input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Time</Label>
                  <Input
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={newDifficulty}
                    onValueChange={(val) => setNewDifficulty(val as any)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="All Levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    value={String(newRating)}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>Highlights (comma separated)</Label>
                <Input
                  value={newHighlights}
                  onChange={(e) => setNewHighlights(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingClass(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateClass}>Update Class</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(classesQuery.data || []).map((classItem: GymClass) => (
          <Card key={classItem.classID} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {classItem.className}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {classItem.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClass(classItem.classID);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Trainer:</span>
                  <span className="font-medium">{classItem.trainerName}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{classItem.time}</span>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Enrollment
                    </span>
                    <span className="text-xs font-semibold">
                      {classItem.assignedCount}/{classItem.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        classItem.assignedCount >= classItem.capacity
                          ? "bg-red-500"
                          : "bg-accent"
                      }`}
                      style={{
                        width: `${
                          (classItem.assignedCount / classItem.capacity) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">
                      Duration
                    </div>
                    <div className="font-semibold">{classItem.duration}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-semibold">
                      ${classItem.price ?? "-"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Level</div>
                    <div className="font-semibold text-xs">
                      {classItem.difficulty}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      navigate(`/admin/classes/${classItem.classID}`)
                    }
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Roster
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(classItem);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminClassesView;
