import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Users, Plus, Edit, Trash2 } from "lucide-react";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { TrainerSchedule } from "@/api/schedule";

const TrainerScheduleView = () => {
  const { userCredentials } = useAuth();
  const queryClient = useQueryClient();
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TrainerSchedule | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: true,
    notes: "",
  });

  // Get trainer data
  const { data: trainerData } = api.trainers.getTrainerData.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  // Get trainer's schedules
  const { data: trainerSchedules } = api.schedule.getSchedulesByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  // Create schedule mutation
  const createScheduleMutation = api.schedule.createSchedule.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSchedulesByTrainerId"] });
      toast.success("Schedule created successfully");
      setShowScheduleDialog(false);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to create schedule");
    },
  });

  // Update schedule mutation
  const updateScheduleMutation = api.schedule.updateSchedule.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSchedulesByTrainerId"] });
      toast.success("Schedule updated successfully");
      setShowScheduleDialog(false);
      setEditingSchedule(null);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to update schedule");
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = api.schedule.deleteSchedule.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSchedulesByTrainerId"] });
      toast.success("Schedule deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete schedule");
    },
  });

  const resetForm = () => {
    setScheduleForm({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
      notes: "",
    });
    setEditingSchedule(null);
  };

  const handleOpenDialog = (schedule?: TrainerSchedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleForm({
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isAvailable: schedule.isAvailable,
        notes: schedule.notes || "",
      });
    } else {
      resetForm();
    }
    setShowScheduleDialog(true);
  };

  const handleSubmit = () => {
    if (!trainerData?.trainerID) return;

    if (editingSchedule) {
      updateScheduleMutation.mutate({
        scheduleID: editingSchedule.scheduleID,
        trainerID: trainerData.trainerID,
        ...scheduleForm,
      });
    } else {
      createScheduleMutation.mutate({
        trainerID: trainerData.trainerID,
        ...scheduleForm,
      });
    }
  };

  const handleDelete = (scheduleID: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      deleteScheduleMutation.mutate(scheduleID);
    }
  };

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Group schedules by day
  const schedulesByDay = daysOfWeek.map((day, index) => ({
    day,
    schedules: (trainerSchedules || []).filter((s) => s.dayOfWeek === index),
  }));

  // Get trainer's classes directly
  const { data: trainerClasses } = api.classes.getClassesByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  // Group classes by day of week
  const groupClassesByDay = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const grouped: Record<string, GymClass[]> = {};

    // Initialize all days with empty arrays
    days.forEach((day) => {
      grouped[day] = [];
    });

    // Map day abbreviations to full names
    const dayMap: Record<string, string> = {
      'mon': 'Monday',
      'tue': 'Tuesday',
      'wed': 'Wednesday',
      'thu': 'Thursday',
      'fri': 'Friday',
      'sat': 'Saturday',
      'sun': 'Sunday'
    };

    // Group classes by parsing the time string
    (trainerClasses || []).forEach((classItem) => {
      // The time field format: "Mon, Wed, Fri • 6:30 AM"
      // Split by bullet point or dash to get the days part
      const timeParts = classItem.time.split(/[•·-]/);
      const daysString = timeParts[0].trim().toLowerCase();
      
      // Split by comma to get individual days
      const classDays = daysString.split(',').map(d => d.trim());
      
      // Add this class to each matching day
      classDays.forEach((dayAbbr) => {
        const fullDay = dayMap[dayAbbr];
        if (fullDay && grouped[fullDay]) {
          grouped[fullDay].push(classItem);
        }
      });
    });

    return grouped;
  };

  const classesByDay = groupClassesByDay();

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">My Schedule</h1>
          <p className="text-muted-foreground">
            Manage your weekly availability and class schedule
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Availability
        </Button>
      </div>

      {/* Weekly Availability Schedule */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Weekly Availability</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedulesByDay.map(({ day, schedules }) => (
            <Card key={day} className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  {day}
                </CardTitle>
                <CardDescription>
                  {schedules.length === 0
                    ? "No availability set"
                    : `${schedules.length} time slot${schedules.length > 1 ? "s" : ""}`}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {schedules.length > 0 ? (
                  <div className="space-y-3">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.scheduleID}
                        className="rounded-lg border bg-gradient-card p-3"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                          </div>
                          <Badge variant={schedule.isAvailable ? "default" : "secondary"}>
                            {schedule.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        {schedule.notes && (
                          <p className="text-xs text-muted-foreground mb-2">{schedule.notes}</p>
                        )}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(schedule)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(schedule.scheduleID)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground opacity-20 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No availability set for this day
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Classes Schedule */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Class Schedule</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weekDays.map((day) => {
            const dayClasses = classesByDay[day] || [];

            return (
              <Card key={day} className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    {day}
                  </CardTitle>
                  <CardDescription>
                    {dayClasses.length === 0
                      ? "No classes scheduled"
                      : `${dayClasses.length} class${dayClasses.length > 1 ? "es" : ""}`}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {dayClasses.length > 0 ? (
                    <div className="space-y-3">
                      {dayClasses.map((classItem) => (
                        <div
                          key={classItem.classID}
                          className="rounded-lg border bg-gradient-card p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{classItem.className}</h4>
                            <Badge variant="outline" className="text-xs">
                              {classItem.difficulty}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Clock className="h-3 w-3" />
                            <span>{classItem.time}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{classItem.assignedCount}/{classItem.capacity} enrolled</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="h-8 w-8 text-muted-foreground opacity-20 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No classes on this day
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Edit Availability" : "Add Availability"}
            </DialogTitle>
            <DialogDescription>
              Set your available time slots for training sessions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Day of Week</Label>
              <select
                id="dayOfWeek"
                value={scheduleForm.dayOfWeek}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, dayOfWeek: parseInt(e.target.value) })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {daysOfWeek.map((day, index) => (
                  <option key={day} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div  className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={scheduleForm.startTime}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={scheduleForm.endTime}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={scheduleForm.isAvailable}
                onCheckedChange={(checked: boolean) =>
                  setScheduleForm({ ...scheduleForm, isAvailable: checked })
                }
              />
              <Label htmlFor="isAvailable">Available for booking</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="e.g., Prefer outdoor training"
                value={scheduleForm.notes}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowScheduleDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingSchedule ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerScheduleView;
