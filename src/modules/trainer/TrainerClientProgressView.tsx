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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, TrendingDown, Minus, User, Plus, Upload, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/api";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import type { Progress } from "@/api/progress/type";

const progressSchema = z.object({
  userID: z.string().min(1, "Please select a client"),
  goalWeight: z.coerce.number().min(1, "Goal weight must be positive"),
  currentWeight: z.coerce.number().min(1, "Current weight must be positive"),
  bodyFat: z.coerce.number().min(0).max(100, "Body fat must be between 0-100"),
  chest: z.coerce.number().optional().nullable(),
  waist: z.coerce.number().optional().nullable(),
  arms: z.coerce.number().optional().nullable(),
  thighs: z.coerce.number().optional().nullable(),
  hips: z.coerce.number().optional().nullable(),
  notes: z.string().default(""),
  imageUrl: z.string().optional().nullable(),
});

const TrainerClientProgressView = () => {
  const { userCredentials } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedProgressImage, setSelectedProgressImage] = useState<string | null>(null);

  // Get trainer data first
  const { data: trainerData } = api.trainers.getTrainerData.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  // Fetch trainer's clients
  const { data: clients } = api.trainers.getClient.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  // Fetch all progress entries for trainer's clients
  const { data: progressEntries, refetch } = api.progress.getUserProgressByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  const form = useForm({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      userID: "",
      goalWeight: 0,
      currentWeight: 0,
      bodyFat: 0,
      chest: null,
      waist: null,
      arms: null,
      thighs: null,
      hips: null,
      notes: "",
      imageUrl: null,
    },
  });

  const { mutate: uploadFileMutation } = api.files.uploadFile.useMutation();

  const { mutate: addProgressMutation, isPending } = api.progress.addProgress.useMutation({
    onSuccess: () => {
      toast.success("Progress added successfully!");
      setShowAddDialog(false);
      form.reset();
      setSelectedFile(null);
      setImagePreview(null);
      refetch();
    },
    onError: () => {
      toast.error("Failed to add progress. Please try again.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    form.setValue("imageUrl", null);
  };

  const onSubmit = async (values: any) => {
    setIsUploadingImage(true);
    let imageUrl = values.imageUrl;

    try {
      // Upload image if selected
      if (selectedFile) {
        imageUrl = await new Promise<string>((resolve, reject) => {
          uploadFileMutation(selectedFile, {
            onSuccess: (url) => resolve(url),
            onError: () => reject(new Error("Image upload failed")),
          });
        });
      }

      const payload = {
        ...values,
        imageUrl: imageUrl || null,
        chest: values.chest || null,
        waist: values.waist || null,
        arms: values.arms || null,
        thighs: values.thighs || null,
        hips: values.hips || null,
      };
      
      addProgressMutation(payload);
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const getWeightTrend = (userId: string) => {
    const userEntries = progressEntries
      ?.filter((e) => e.userID === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    if (!userEntries || userEntries.length < 2) return null;

    const latest = userEntries[0].currentWeight;
    const previous = userEntries[1].currentWeight;
    const diff = latest - previous;

    if (Math.abs(diff) < 0.1) return { trend: "stable", diff };
    return { trend: diff < 0 ? "down" : "up", diff };
  };

  const getClientName = (userId: string) => {
    return clients?.find((c) => c.userID === userId)?.name || "Unknown Client";
  };

  const getClientPfp = (userId: string) => {
    return clients?.find(c => c.userID === userId)?.imageUrl || undefined;
  }

  const getSelectedClient = () => {
    return clients?.find((c) => c.userID === selectedClientId);
  };

  const isFemale = () => {
    const client = getSelectedClient();
    return client?.gender?.toLowerCase() === "female";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Client Progress</h1>
          <p className="text-muted-foreground">
            Track and review your clients' progress over time
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Progress
        </Button>
      </div>

      <div className="space-y-6">
        {progressEntries && progressEntries.length > 0 ? (
          progressEntries
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .map((entry) => {
            const trend = getWeightTrend(entry.userID);

            return (
              <Card key={entry.progressID} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                        {getClientPfp(entry.userID) ? (
                          <img
                            src={getClientPfp(entry.userID)}
                            alt={getClientName(entry.userID)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle>{getClientName(entry.userID)}</CardTitle>
                        <CardDescription>
                          {new Date(entry.createdAt || new Date()).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </div>
                    </div>

                    {trend && (
                      <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                          trend.trend === "down"
                            ? "bg-green-500/10 text-green-600"
                            : trend.trend === "up"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {trend.trend === "down" ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : trend.trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                        {Math.abs(trend.diff).toFixed(1)}kg
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {entry.imageUrl && (
                    <div className="mb-4">
                      <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg border bg-secondary cursor-pointer hover:opacity-90 transition-opacity"
                           onClick={() => setSelectedProgressImage(entry.imageUrl)}>
                        <img
                          src={entry.imageUrl}
                          alt="Progress"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <div className="rounded-lg bg-gradient-card p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Current Weight
                      </div>
                      <div className="text-2xl font-bold">{entry.currentWeight} kg</div>
                    </div>

                    <div className="rounded-lg bg-gradient-card p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Goal Weight
                      </div>
                      <div className="text-2xl font-bold">{entry.goalWeight} kg</div>
                    </div>

                    <div className="rounded-lg bg-gradient-card p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Body Fat
                      </div>
                      <div className="text-2xl font-bold">
                        {entry.bodyFat}%
                      </div>
                    </div>
                  </div>

                  {(entry.chest || entry.waist || entry.arms || entry.thighs || entry.hips) && (
                    <div className="mb-4 rounded-lg border bg-secondary/30 p-4">
                      <div className="text-sm font-semibold mb-3">
                        Measurements (cm)
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {entry.chest && (
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Chest
                            </div>
                            <div className="font-semibold">
                              {entry.chest}
                            </div>
                          </div>
                        )}
                        {entry.waist && (
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Waist
                            </div>
                            <div className="font-semibold">
                              {entry.waist}
                            </div>
                          </div>
                        )}
                        {entry.hips && (
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Hips
                            </div>
                            <div className="font-semibold">
                              {entry.hips}
                            </div>
                          </div>
                        )}
                        {entry.arms && (
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Arms
                            </div>
                            <div className="font-semibold">
                              {entry.arms}
                            </div>
                          </div>
                        )}
                        {entry.thighs && (
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Thighs
                            </div>
                            <div className="font-semibold">
                              {entry.thighs}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="rounded-lg border bg-gradient-card p-4">
                      <div className="text-sm font-semibold mb-2">
                        Trainer Notes
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <TrendingUp className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="font-semibold mb-2">No Progress Entries Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add progress entries to track your clients' journey
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Progress
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Progress Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Client Progress</DialogTitle>
            <DialogDescription>
              Record progress measurements for your client
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedClientId(value);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients?.map((client) => (
                          <SelectItem key={client.clientID} value={client.userID}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goalWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bodyFat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Fat (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Measurements (cm) - Optional</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {!isFemale() && (
                    <FormField
                      control={form.control}
                      name="chest"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              placeholder="Chest" 
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="waist"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="Waist" 
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isFemale() && (
                    <FormField
                      control={form.control}
                      name="hips"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              placeholder="Hips" 
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {!isFemale() && (
                    <>
                      <FormField
                        control={form.control}
                        name="arms"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1" 
                                placeholder="Arms" 
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="thighs"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1" 
                                placeholder="Thighs" 
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any observations or recommendations..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress Photo (Optional)</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {imagePreview ? (
                          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-secondary">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload progress photo
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG up to 5MB
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || isUploadingImage}>
                  {isUploadingImage ? "Uploading Image..." : isPending ? "Adding..." : "Add Progress"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={!!selectedProgressImage} onOpenChange={() => setSelectedProgressImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Progress Photo</DialogTitle>
          </DialogHeader>
          {selectedProgressImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-secondary">
              <img
                src={selectedProgressImage}
                alt="Progress"
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerClientProgressView;
