import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

const TrainerScheduleView = () => {
  const [availability, setAvailability] = useState<TimeSlot[]>([
    {
      id: "1",
      day: "Monday",
      startTime: "09:00",
      endTime: "17:00",
      isRecurring: true,
    },
    {
      id: "2",
      day: "Wednesday",
      startTime: "10:00",
      endTime: "18:00",
      isRecurring: true,
    },
    {
      id: "3",
      day: "Friday",
      startTime: "08:00",
      endTime: "16:00",
      isRecurring: true,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDay, setNewDay] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newIsRecurring, setNewIsRecurring] = useState(true);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddSlot = () => {
    if (!newDay || !newStartTime || !newEndTime) {
      toast.error("Please fill in all fields");
      return;
    }

    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      isRecurring: newIsRecurring,
    };

    setAvailability([...availability, newSlot]);
    toast.success("Time slot added successfully!");
    setIsDialogOpen(false);
    setNewDay("");
    setNewStartTime("");
    setNewEndTime("");
    setNewIsRecurring(true);
  };

  const handleRemoveSlot = (slotId: string) => {
    setAvailability(availability.filter((s) => s.id !== slotId));
    toast.success("Time slot removed");
  };

  const getSlotsByDay = (day: string) => {
    return availability.filter((slot) => slot.day === day);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Schedule & Availability</h1>
          <p className="text-muted-foreground">
            Manage your weekly availability for client sessions
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Availability Slot</DialogTitle>
              <DialogDescription>
                Set when you're available for client sessions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <select
                  id="day"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                >
                  <option value="">Select a day</option>
                  {weekDays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={newIsRecurring}
                  onCheckedChange={(checked) =>
                    setNewIsRecurring(checked as boolean)
                  }
                />
                <label
                  htmlFor="recurring"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Repeat weekly
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSlot}>Add Slot</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {weekDays.map((day) => {
          const daySlots = getSlotsByDay(day);

          return (
            <Card key={day} className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  {day}
                </CardTitle>
                <CardDescription>
                  {daySlots.length === 0
                    ? "No availability set"
                    : `${daySlots.length} slot${daySlots.length > 1 ? "s" : ""}`}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {daySlots.length > 0 ? (
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between rounded-lg border bg-gradient-card p-3"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-accent" />
                          <div className="text-sm">
                            <div className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </div>
                            {slot.isRecurring && (
                              <div className="text-xs text-muted-foreground">
                                Weekly recurring
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSlot(slot.id)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground opacity-20 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No slots for this day
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card mt-6">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-gradient-card p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Total Hours/Week
              </div>
              <div className="text-2xl font-bold">
                {availability.reduce((total, slot) => {
                  const start = new Date(`2000-01-01 ${slot.startTime}`);
                  const end = new Date(`2000-01-01 ${slot.endTime}`);
                  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  return total + hours;
                }, 0)}
                h
              </div>
            </div>
            <div className="rounded-lg bg-gradient-card p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Days Available
              </div>
              <div className="text-2xl font-bold">
                {new Set(availability.map((s) => s.day)).size}
              </div>
            </div>
            <div className="rounded-lg bg-gradient-card p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Time Slots
              </div>
              <div className="text-2xl font-bold">{availability.length}</div>
            </div>
            <div className="rounded-lg bg-gradient-card p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Recurring Slots
              </div>
              <div className="text-2xl font-bold">
                {availability.filter((s) => s.isRecurring).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerScheduleView;
