import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, Star, UploadCloud } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getAllTrainers,
  addNewTrainer,
  suspendTrainer,
  activateTrainer,
} from "@/api/trainer";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "@/api/files";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type CreateTrainerFormState = {
  name: string;
  email: string;
  fees: string;
  specialty: string;
  experience: string;
  rating: string;
  clients: string;
  imageUrl: string | null;
  certifications: string;
  description: string;
  specialties: string;
};

const emptyTrainerFormState: CreateTrainerFormState = {
  name: "",
  email: "",
  fees: "",
  specialty: "",
  experience: "",
  rating: "0",
  clients: "0",
  imageUrl: null,
  certifications: "",
  description: "",
  specialties: "",
};

const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_PROFILE_PHOTO_TYPES = ["image/jpeg", "image/png", "image/jpg"] as const;

const AdminTrainersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formState, setFormState] = useState<CreateTrainerFormState>(emptyTrainerFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const trainersQuery = getAllTrainers.useQuery();

  const uploadPhotoMutation = uploadFile.useMutation({
    onSuccess: (fileUrl) => {
      setFormState((prev) => ({ ...prev, imageUrl: fileUrl }));
      toast.success("Photo uploaded");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ?? error?.message ?? "Failed to upload photo";
      toast.error(message);
    },
  });

  const createTrainerMutation = addNewTrainer.useMutation({
    onSuccess: () => {
      toast.success("Trainer created successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllTrainers"] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to create trainer");
    },
  });

  const suspendMutation = suspendTrainer.useMutation({
    onSuccess: () => {
      toast.success("Trainer suspended");
      queryClient.invalidateQueries({ queryKey: ["getAllTrainers"] });
    },
    onError: () => toast.error("Failed to suspend trainer"),
  });

  const activateMutation = activateTrainer.useMutation({
    onSuccess: () => {
      toast.success("Trainer activated");
      queryClient.invalidateQueries({ queryKey: ["getAllTrainers"] });
    },
    onError: () => toast.error("Failed to activate trainer"),
  });

  const filteredTrainers = (trainersQuery.data || []).filter(
    (trainer: any) =>
      (trainer.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trainer.email ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormState(emptyTrainerFormState);
    setImageFile(null);
  };

  const imagePreview = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    if (formState.imageUrl) {
      return formState.imageUrl;
    }
    return null;
  }, [imageFile, formState.imageUrl]);

  const handleInputChange = (field: keyof CreateTrainerFormState) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PROFILE_PHOTO_SIZE) {
      toast.error("Image must be 5MB or smaller");
      e.target.value = "";
      return;
    }

    const isAllowed = ALLOWED_PROFILE_PHOTO_TYPES.some(
      (type) => file.type === type
    );
    if (!isAllowed) {
      toast.error("Only JPG and PNG images are supported");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    e.target.value = "";
  };

  const handleCreateTrainer = async () => {
    if (!formState.name.trim() || !formState.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!formState.specialty.trim()) {
      toast.error("Specialty is required");
      return;
    }

    if (!formState.fees.trim() || Number(formState.fees) < 0) {
      toast.error("Valid fees amount is required");
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadPhotoMutation.mutateAsync(imageFile);
      }

      const payload: AddTrainer = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        specialty: formState.specialty.trim(),
        experience: formState.experience.trim(),
        rating: Number(formState.rating) || 0,
        clients: Number(formState.clients) || 0,
        fees: Number(formState.fees),
        imageUrl,
        certifications: formState.certifications
          ? formState.certifications.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        description: formState.description.trim(),
        specialties: formState.specialties
          ? formState.specialties.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      createTrainerMutation.mutate(payload);
    } catch (error) {
      console.error("Create trainer error:", error);
      toast.error("Failed to upload image or create trainer");
    }
  };

  const isCreating = createTrainerMutation.isPending;
  const isUploading = uploadPhotoMutation.isPending;
  const isBusy = isCreating || isUploading;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Trainer Management</h1>
          <p className="text-muted-foreground">
            Manage trainer applications and performance
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Trainer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Trainer</DialogTitle>
              <DialogDescription>
                Fill in all trainer details to create a new trainer profile
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter trainer name"
                    value={formState.name}
                    onChange={handleInputChange("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="trainer@example.com"
                    value={formState.email}
                    onChange={handleInputChange("email")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Primary Specialty *</Label>
                  <Input
                    id="specialty"
                    placeholder="e.g., Strength Training"
                    value={formState.specialty}
                    onChange={handleInputChange("specialty")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 5 years"
                    value={formState.experience}
                    onChange={handleInputChange("experience")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fees">Session Fee ($) *</Label>
                  <Input
                    id="fees"
                    type="number"
                    min="0"
                    value={formState.fees}
                    onChange={handleInputChange("fees")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formState.rating}
                    onChange={handleInputChange("rating")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clients">Clients Trained</Label>
                  <Input
                    id="clients"
                    type="number"
                    min="0"
                    value={formState.clients}
                    onChange={handleInputChange("clients")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Professional Bio *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Share trainer's story, philosophy, and approach..."
                    value={formState.description}
                    onChange={handleInputChange("description")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                  <Textarea
                    id="specialties"
                    rows={2}
                    placeholder="e.g., Weight Loss, Muscle Building, HIIT"
                    value={formState.specialties}
                    onChange={handleInputChange("specialties")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                  <Textarea
                    id="certifications"
                    rows={2}
                    placeholder="e.g., NASM-CPT, ACE, ISSA"
                    value={formState.certifications}
                    onChange={handleInputChange("certifications")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Profile Photo</Label>
                  <p className="text-xs text-muted-foreground">
                    Upload a square image (max 5MB). Supported formats: JPG, PNG.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="mr-2 h-4 w-4" />
                          {imagePreview ? "Change Photo" : "Upload Photo"}
                        </>
                      )}
                    </Button>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-20 rounded-md border object-cover"
                      />
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isBusy}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleCreateTrainer}
                disabled={isBusy}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Trainer"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Trainers */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search trainers by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Trainers List */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Active Trainers ({filteredTrainers.length})
        </h2>
        {trainersQuery.isLoading && <div>Loading trainers...</div>}
        {trainersQuery.isError && (
          <div className="text-destructive">Failed to load trainers</div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrainers.map((trainer: any) => (
            <Card key={trainer.trainerID} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{trainer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(trainer.specialties || []).join(" \u2022 ")}
                    </p>
                  </div>
                  {trainer.rating && (
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-semibold">
                        {trainer.rating}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <div className="text-xs text-muted-foreground">Clients</div>
                    <div className="font-bold">{trainer.clients || 0}</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <div className="text-xs text-muted-foreground">
                      Experience
                    </div>
                    <div className="font-bold">{trainer.experience || 0}</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <div className="text-xs text-muted-foreground">Fees</div>
                    <div className="font-bold text-sm">
                      {trainer.fees ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {(trainer.certifications || []).map(
                    (cert: any, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600"
                      >
                        {cert}
                      </span>
                    )
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/admin/trainers/${trainer.trainerID}`)
                    }
                  >
                    View Details
                  </Button>
                  {trainer.activeFlag ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => suspendMutation.mutate(trainer.trainerID)}
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => activateMutation.mutate(trainer.trainerID)}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTrainersView;
