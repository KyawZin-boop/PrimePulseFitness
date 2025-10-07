import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import type { ClassSession } from "@/types";
import { toast } from "sonner";

const TrainerSessionsView = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState<Partial<ClassSession>>({
    className: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    duration: 60,
    maxCapacity: 15,
    isFree: false,
    price: 35,
    location: "",
  });

  // Mock sessions - replace with API call
  const [sessions, setSessions] = useState<ClassSession[]>([
    {
      id: "1",
      classId: "1",
      className: "Strength Forge",
      trainerId: "trainer-1",
      trainerName: "Mike Chen",
      date: new Date("2025-10-08"),
      startTime: "09:00",
      endTime: "10:00",
      duration: 60,
      maxCapacity: 15,
      currentBookings: 8,
      isFree: false,
      price: 35,
      location: "Studio A",
    },
    {
      id: "2",
      classId: "2",
      className: "Cardio Surge",
      trainerId: "trainer-1",
      trainerName: "Mike Chen",
      date: new Date("2025-10-09"),
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      maxCapacity: 20,
      currentBookings: 18,
      isFree: true,
      price: 0,
      location: "Studio B",
    },
  ]);

  const handleCreateSession = () => {
    const session: ClassSession = {
      id: `session-${Date.now()}`,
      classId: "1",
      className: newSession.className || "",
      trainerId: "trainer-1",
      trainerName: "Current Trainer",
      date: newSession.date || new Date(),
      startTime: newSession.startTime || "",
      endTime: newSession.endTime || "",
      duration: newSession.duration || 60,
      maxCapacity: newSession.maxCapacity || 15,
      currentBookings: 0,
      isFree: newSession.isFree || false,
      price: newSession.price || 0,
      location: newSession.location || "",
    };

    setSessions([...sessions, session]);
    setShowCreateModal(false);
    setNewSession({
      className: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      duration: 60,
      maxCapacity: 15,
      isFree: false,
      price: 35,
      location: "",
    });
    toast.success("Session created successfully!");
  };

  const handleCancelSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success("Session cancelled");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Session Management</h1>
          <p className="text-muted-foreground">
            Create and manage your class sessions
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Session
        </Button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const spotsLeft = session.maxCapacity - session.currentBookings;
          const isFull = spotsLeft <= 0;

          return (
            <Card key={session.id} className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{session.className}</h3>
                      {session.isFree ? (
                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500">
                          FREE
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-accent">
                          ${session.price}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {session.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {session.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span className={isFull ? "text-red-500 font-medium" : ""}>
                          {session.currentBookings}/{session.maxCapacity}
                          {isFull && " (Full)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelSession(session.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Session Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
            <DialogDescription>
              Schedule a new class session for your students
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  value={newSession.className}
                  onChange={(e) =>
                    setNewSession({ ...newSession, className: e.target.value })
                  }
                  placeholder="Strength Forge"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newSession.location}
                  onChange={(e) =>
                    setNewSession({ ...newSession, location: e.target.value })
                  }
                  placeholder="Studio A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSession.date?.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewSession({ ...newSession, date: new Date(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newSession.startTime}
                  onChange={(e) =>
                    setNewSession({ ...newSession, startTime: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newSession.endTime}
                  onChange={(e) =>
                    setNewSession({ ...newSession, endTime: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Max Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newSession.maxCapacity}
                  onChange={(e) =>
                    setNewSession({ ...newSession, maxCapacity: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionType">Session Type</Label>
                <select
                  id="sessionType"
                  value={newSession.isFree ? "free" : "private"}
                  onChange={(e) =>
                    setNewSession({ ...newSession, isFree: e.target.value === "free" })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="free">Free Tutorial</option>
                  <option value="private">Private (Paid)</option>
                </select>
              </div>

              {!newSession.isFree && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newSession.price}
                    onChange={(e) =>
                      setNewSession({ ...newSession, price: parseFloat(e.target.value) })
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSession} className="flex-1">
                Create Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerSessionsView;
