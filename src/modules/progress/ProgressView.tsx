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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Calendar,
  Download,
  Plus,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { ProgressEntry } from "@/types";
import { toast } from "sonner";

const ProgressView = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    weight: undefined,
    bodyFat: undefined,
    muscleMass: undefined,
    notes: "",
  });

  // Mock progress data - replace with API call
  const [progressData, setProgressData] = useState<ProgressEntry[]>([
    {
      id: "entry-1",
      userId: "user-1",
      date: new Date("2025-10-01"),
      weight: 75,
      bodyFat: 18,
      muscleMass: 35,
      notes: "Feeling stronger after consistent training",
    },
    {
      id: "entry-2",
      userId: "user-1",
      date: new Date("2025-09-15"),
      weight: 76.5,
      bodyFat: 19.5,
      muscleMass: 34,
      notes: "Started new diet plan",
    },
    {
      id: "entry-3",
      userId: "user-1",
      date: new Date("2025-09-01"),
      weight: 77,
      bodyFat: 20,
      muscleMass: 33.5,
    },
  ]);

  const handleAddEntry = () => {
    const entry: ProgressEntry = {
      id: `entry-${Date.now()}`,
      userId: "user-1",
      date: new Date(),
      weight: newEntry.weight,
      bodyFat: newEntry.bodyFat,
      muscleMass: newEntry.muscleMass,
      notes: newEntry.notes,
    };

    setProgressData([entry, ...progressData]);
    setShowAddModal(false);
    setNewEntry({
      weight: undefined,
      bodyFat: undefined,
      muscleMass: undefined,
      notes: "",
    });
    toast.success("Progress entry added!");
  };

  const handleExport = () => {
    const csvContent = [
      ["Date", "Weight (kg)", "Body Fat (%)", "Muscle Mass (kg)", "Notes"],
      ...progressData.map((entry) => [
        entry.date.toLocaleDateString(),
        entry.weight || "",
        entry.bodyFat || "",
        entry.muscleMass || "",
        entry.notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `progress_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Progress data exported!");
  };

  // Calculate changes
  const latestEntry = progressData[0];
  const oldestEntry = progressData[progressData.length - 1];
  const weightChange = latestEntry && oldestEntry
    ? latestEntry.weight! - oldestEntry.weight!
    : 0;
  const bodyFatChange = latestEntry && oldestEntry
    ? latestEntry.bodyFat! - oldestEntry.bodyFat!
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Fitness Progress</h1>
          <p className="text-muted-foreground">
            Track your journey and celebrate your wins
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Scale className="h-4 w-4" />
                Current Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {latestEntry?.weight || "--"} kg
              </div>
              {weightChange !== 0 && (
                <div
                  className={`mt-2 flex items-center gap-1 text-sm ${
                    weightChange < 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {weightChange < 0 ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {Math.abs(weightChange).toFixed(1)} kg from start
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Activity className="h-4 w-4" />
                Body Fat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {latestEntry?.bodyFat || "--"}%
              </div>
              {bodyFatChange !== 0 && (
                <div
                  className={`mt-2 flex items-center gap-1 text-sm ${
                    bodyFatChange < 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {bodyFatChange < 0 ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {Math.abs(bodyFatChange).toFixed(1)}% from start
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Muscle Mass
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {latestEntry?.muscleMass || "--"} kg
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {latestEntry?.date.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Timeline */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Progress Timeline
            </CardTitle>
            <CardDescription>Your measurement history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.map((entry, index) => (
                <div
                  key={entry.id}
                  className="rounded-lg border bg-card p-4 transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">
                          {entry.date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.date.toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 mb-3">
                    {entry.weight && (
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <div className="text-xs text-muted-foreground">
                          Weight
                        </div>
                        <div className="text-lg font-semibold">
                          {entry.weight} kg
                        </div>
                      </div>
                    )}
                    {entry.bodyFat && (
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <div className="text-xs text-muted-foreground">
                          Body Fat
                        </div>
                        <div className="text-lg font-semibold">
                          {entry.bodyFat}%
                        </div>
                      </div>
                    )}
                    {entry.muscleMass && (
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <div className="text-xs text-muted-foreground">
                          Muscle Mass
                        </div>
                        <div className="text-lg font-semibold">
                          {entry.muscleMass} kg
                        </div>
                      </div>
                    )}
                  </div>

                  {entry.notes && (
                    <div className="rounded bg-muted/50 p-2 text-sm">
                      <span className="font-medium">Notes: </span>
                      {entry.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Progress Entry</DialogTitle>
            <DialogDescription>
              Log your current measurements and progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="75.0"
                  value={newEntry.weight || ""}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      weight: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  placeholder="18.0"
                  value={newEntry.bodyFat || ""}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      bodyFat: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="muscleMass">Muscle Mass (kg)</Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  placeholder="35.0"
                  value={newEntry.muscleMass || ""}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      muscleMass: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <textarea
                id="notes"
                placeholder="How are you feeling? Any observations?"
                value={newEntry.notes || ""}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, notes: e.target.value })
                }
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddEntry}
                className="flex-1"
                disabled={!newEntry.weight && !newEntry.bodyFat && !newEntry.muscleMass}
              >
                Add Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressView;
