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
  LogIn,
  Ruler,
  Target,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { getProgressByUserId, addProgress } from "@/api/progress";
import { uploadFile } from "@/api/files";
import type { Progress } from "@/api/progress/type";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Textarea } from "@/components/ui/textarea";

const ProgressView = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userCredentials } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch user progress
  const { data: progressData = [], isLoading, refetch } = getProgressByUserId.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  // Add progress mutation
  const addProgressMutation = addProgress.useMutation({
    onSuccess: () => {
      toast.success("Progress entry added successfully!");
      setShowAddModal(false);
      resetForm();
      refetch();
    },
    onError: () => {
      toast.error("Failed to add progress entry");
    },
  });

  // Upload file mutation
  const uploadFileMutation = uploadFile.useMutation({
    onError: () => {
      toast.error("Failed to upload image");
    },
  });

  const [newEntry, setNewEntry] = useState({
    goalWeight: "",
    currentWeight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    arms: "",
    thighs: "",
    hips: "",
    notes: "",
  });

  const resetForm = () => {
    setNewEntry({
      goalWeight: "",
      currentWeight: "",
      bodyFat: "",
      chest: "",
      waist: "",
      arms: "",
      thighs: "",
      hips: "",
      notes: "",
    });
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleAddEntry = async () => {
    if (!userCredentials?.userId) {
      toast.error("User not authenticated");
      return;
    }

    let imageUrl = "";

    // Upload image if selected
    if (selectedImage) {
      const uploadResult = await uploadFileMutation.mutateAsync(selectedImage);
      imageUrl = uploadResult || "";
    }

    // Prepare progress data
    const progressData: Partial<Progress> = {
      userID: userCredentials.userId,
      imageUrl: imageUrl || undefined,
      goalWeight: newEntry.goalWeight ? parseFloat(newEntry.goalWeight) : undefined,
      currentWeight: newEntry.currentWeight ? parseFloat(newEntry.currentWeight) : undefined,
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined,
      chest: newEntry.chest ? parseFloat(newEntry.chest) : undefined,
      waist: newEntry.waist ? parseFloat(newEntry.waist) : undefined,
      arms: newEntry.arms ? parseFloat(newEntry.arms) : undefined,
      thighs: newEntry.thighs ? parseFloat(newEntry.thighs) : undefined,
      hips: newEntry.hips ? parseFloat(newEntry.hips) : undefined,
      notes: newEntry.notes || undefined,
    };

    addProgressMutation.mutate(progressData as Progress);
  };

  const handleExport = () => {
    const csvContent = [
      ["Date", "Goal Weight (kg)", "Current Weight (kg)", "Body Fat (%)", "Chest (cm)", "Waist (cm)", "Arms (cm)", "Thighs (cm)", "Hips (cm)", "Notes"],
      ...progressData.map((entry) => [
        new Date(entry.createdAt).toLocaleDateString(),
        entry.goalWeight || "",
        entry.currentWeight || "",
        entry.bodyFat || "",
        entry.chest || "",
        entry.waist || "",
        entry.arms || "",
        entry.thighs || "",
        entry.hips || "",
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
  const weightChange = latestEntry && oldestEntry && latestEntry.currentWeight && oldestEntry.currentWeight
    ? latestEntry.currentWeight - oldestEntry.currentWeight
    : 0;
  const bodyFatChange = latestEntry && oldestEntry && latestEntry.bodyFat && oldestEntry.bodyFat
    ? latestEntry.bodyFat - oldestEntry.bodyFat
    : 0;

  // Prepare chart data
  const chartData = [...progressData]
    .reverse()
    .map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: entry.currentWeight || 0,
      bodyFat: entry.bodyFat || 0,
    }));

  // If user is not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="mb-8">
          <h1 className="text-heading mb-2">Fitness Progress</h1>
          <p className="text-muted-foreground">
            Track your journey and celebrate your wins
          </p>
        </div>

        <Card className="shadow-card max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-6">
              <Activity className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Login Required</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Please log in to track your fitness progress and view your measurements
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/auth/login")} size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/classes")} 
                size="lg"
              >
                Browse Classes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : progressData.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-6">
              <Activity className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-semibold text-xl mb-2">No Progress Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start tracking your fitness journey by adding your first progress entry
            </p>
            <Button onClick={() => setShowAddModal(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  Current Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {latestEntry?.currentWeight || "--"} kg
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
                  <Target className="h-4 w-4" />
                  Goal Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {latestEntry?.goalWeight || "--"} kg
                </div>
                {latestEntry?.goalWeight && latestEntry?.currentWeight && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {Math.abs(latestEntry.currentWeight - latestEntry.goalWeight).toFixed(1)} kg to goal
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
                  <Calendar className="h-4 w-4" />
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{progressData.length}</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {new Date(latestEntry?.createdAt || "").toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Weight Progress Chart */}
          {chartData.length > 1 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-accent" />
                  Weight & Body Fat Progress
                </CardTitle>
                <CardDescription>Track your weight and body fat changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="weight"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Weight (kg)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bodyFat"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Body Fat (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

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
                    key={entry.progressID}
                    className="rounded-lg border bg-card p-4 transition hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">
                            {new Date(entry.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          </div>
                        </div>
                      </div>
                      {entry.imageUrl && (
                        <img
                          src={entry.imageUrl}
                          alt="Progress"
                          className="h-16 w-16 rounded-lg object-cover border"
                        />
                      )}
                    </div>

                    {/* Measurements Grid */}
                    <div className="grid gap-3 sm:grid-cols-3 mb-3">
                      {entry.currentWeight && (
                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-xs text-muted-foreground">Current Weight</div>
                          <div className="text-lg font-semibold">{entry.currentWeight} kg</div>
                        </div>
                      )}
                      {entry.goalWeight && (
                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-xs text-muted-foreground">Goal Weight</div>
                          <div className="text-lg font-semibold">{entry.goalWeight} kg</div>
                        </div>
                      )}
                      {entry.bodyFat && (
                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-xs text-muted-foreground">Body Fat</div>
                          <div className="text-lg font-semibold">{entry.bodyFat}%</div>
                        </div>
                      )}
                    </div>

                    {/* Body Measurements */}
                    {(entry.chest || entry.waist || entry.arms || entry.thighs || entry.hips) && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Ruler className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Body Measurements (cm)</span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-5">
                          {entry.chest && (
                            <div className="rounded bg-muted/50 p-2 text-center">
                              <div className="text-xs text-muted-foreground">Chest</div>
                              <div className="font-semibold">{entry.chest}</div>
                            </div>
                          )}
                          {entry.waist && (
                            <div className="rounded bg-muted/50 p-2 text-center">
                              <div className="text-xs text-muted-foreground">Waist</div>
                              <div className="font-semibold">{entry.waist}</div>
                            </div>
                          )}
                          {entry.arms && (
                            <div className="rounded bg-muted/50 p-2 text-center">
                              <div className="text-xs text-muted-foreground">Arms</div>
                              <div className="font-semibold">{entry.arms}</div>
                            </div>
                          )}
                          {entry.thighs && (
                            <div className="rounded bg-muted/50 p-2 text-center">
                              <div className="text-xs text-muted-foreground">Thighs</div>
                              <div className="font-semibold">{entry.thighs}</div>
                            </div>
                          )}
                          {entry.hips && (
                            <div className="rounded bg-muted/50 p-2 text-center">
                              <div className="text-xs text-muted-foreground">Hips</div>
                              <div className="font-semibold">{entry.hips}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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
      )}

      {/* Add Entry Modal */}
      <Dialog open={showAddModal} onOpenChange={(open) => { setShowAddModal(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Progress Entry</DialogTitle>
            <DialogDescription>
              Log your current measurements and progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Progress Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="progressImage">Progress Photo (optional)</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Progress preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-accent transition">
                  <input
                    id="progressImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label htmlFor="progressImage" className="cursor-pointer">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload a progress photo
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Weight Measurements */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  step="0.1"
                  placeholder="75.0"
                  value={newEntry.currentWeight}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      currentWeight: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={newEntry.goalWeight}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      goalWeight: e.target.value,
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
                  value={newEntry.bodyFat}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      bodyFat: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Body Measurements */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Body Measurements (cm) - Optional
              </Label>
              <div className="grid gap-4 sm:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="chest" className="text-xs">Chest</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.1"
                    placeholder="95.0"
                    value={newEntry.chest}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        chest: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist" className="text-xs">Waist</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.1"
                    placeholder="80.0"
                    value={newEntry.waist}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        waist: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arms" className="text-xs">Arms</Label>
                  <Input
                    id="arms"
                    type="number"
                    step="0.1"
                    placeholder="35.0"
                    value={newEntry.arms}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        arms: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thighs" className="text-xs">Thighs</Label>
                  <Input
                    id="thighs"
                    type="number"
                    step="0.1"
                    placeholder="55.0"
                    value={newEntry.thighs}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        thighs: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hips" className="text-xs">Hips</Label>
                  <Input
                    id="hips"
                    type="number"
                    step="0.1"
                    placeholder="95.0"
                    value={newEntry.hips}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        hips: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How are you feeling? Any observations?"
                value={newEntry.notes}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, notes: e.target.value })
                }
                rows={3}
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
                disabled={
                  addProgressMutation.isPending ||
                  uploadFileMutation.isPending ||
                  (!newEntry.currentWeight && !newEntry.bodyFat)
                }
              >
                {(addProgressMutation.isPending || uploadFileMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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
