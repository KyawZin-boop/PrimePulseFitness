import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Plus, Trash2, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Class {
  id: string;
  name: string;
  description: string;
  trainer: string;
  trainerId: string;
  schedule: string;
  duration: number;
  capacity: number;
  enrolled: number;
  price: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const AdminClassesView = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      name: "HIIT Cardio Blast",
      description: "High-intensity interval training for maximum calorie burn",
      trainer: "Mike Chen",
      trainerId: "trainer-1",
      schedule: "Mon, Wed, Fri - 6:00 AM",
      duration: 45,
      capacity: 20,
      enrolled: 18,
      price: 25,
      difficulty: "Intermediate",
    },
    {
      id: "2",
      name: "Yoga Flow",
      description: "Vinyasa flow yoga for flexibility and mindfulness",
      trainer: "Emma Davis",
      trainerId: "trainer-2",
      schedule: "Tue, Thu - 7:00 AM",
      duration: 60,
      capacity: 15,
      enrolled: 12,
      price: 20,
      difficulty: "Beginner",
    },
    {
      id: "3",
      name: "Strength & Conditioning",
      description: "Build muscle and increase strength with compound movements",
      trainer: "Mike Chen",
      trainerId: "trainer-1",
      schedule: "Mon, Wed, Fri - 5:00 PM",
      duration: 60,
      capacity: 25,
      enrolled: 25,
      price: 30,
      difficulty: "Advanced",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const handleCreateClass = () => {
    if (!newClassName || !newDescription || !newCapacity || !newPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: newClassName,
      description: newDescription,
      trainer: "Unassigned",
      trainerId: "",
      schedule: "To be scheduled",
      duration: 60,
      capacity: parseInt(newCapacity),
      enrolled: 0,
      price: parseInt(newPrice),
      difficulty: "Beginner",
    };

    setClasses([newClass, ...classes]);
    toast.success("Class created successfully!");
    setIsDialogOpen(false);
    setNewClassName("");
    setNewDescription("");
    setNewCapacity("");
    setNewPrice("");
  };

  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter((c) => c.id !== classId));
    toast.success("Class deleted");
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
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="Brief description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="25"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {classItem.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteClass(classItem.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Trainer:</span>
                  <span className="font-medium">{classItem.trainer}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{classItem.schedule}</span>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Enrollment
                    </span>
                    <span className="text-xs font-semibold">
                      {classItem.enrolled}/{classItem.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        classItem.enrolled >= classItem.capacity
                          ? "bg-red-500"
                          : "bg-accent"
                      }`}
                      style={{
                        width: `${
                          (classItem.enrolled / classItem.capacity) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="font-semibold">{classItem.duration}m</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-semibold">${classItem.price}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Level</div>
                    <div className="font-semibold text-xs">
                      {classItem.difficulty}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-3 w-3 mr-1" />
                    Roster
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
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
