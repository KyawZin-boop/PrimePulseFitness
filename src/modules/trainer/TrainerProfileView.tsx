import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, Save, UploadCloud, User } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";

type FormState = {
  name: string;
  email: string;
  specialty: string;
  experience: string;
  description: string;
  specialties: string;
  certifications: string;
  fees: string;
  rating: string;
  clients: string;
  imageUrl: string;
};

const emptyFormState: FormState = {
  name: "",
  email: "",
  specialty: "",
  experience: "",
  description: "",
  specialties: "",
  certifications: "",
  fees: "",
  rating: "",
  clients: "",
  imageUrl: "",
};

const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_PROFILE_PHOTO_TYPES = ["image/jpeg", "image/png", "image/jpg"] as const;

const TrainerProfileView = () => {
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const trainerQuery = api.trainers.getTrainerData.useQuery(userId, {
    enabled: Boolean(userId),
  });

  const trainer = trainerQuery.data;
  const trainerId = trainer?.trainerID ?? "";

  const uploadPhotoMutation = api.files.uploadFile.useMutation({
    onSuccess: (fileUrl) => {
      setFormState((previous) => ({ ...previous, imageUrl: fileUrl }));
      toast.success("Profile photo uploaded");
    },
    onError: (error) => {
      const fallbackMessage = typeof error?.message === "string" ? error.message : undefined;
      const apiMessage = error?.response?.data?.message as string | undefined;
      toast.error(apiMessage ?? fallbackMessage ?? "Failed to upload photo");
    },
  });

  const updateTrainerMutation = api.trainers.updateTrainer.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      trainerQuery.refetch();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to update profile");
    },
  });

  const isSaving = updateTrainerMutation.isPending;
  const isUploadingPhoto = uploadPhotoMutation.isPending;

  const fillFormFromTrainer = (source: Trainer) => ({
    name: source.name ?? "",
    email: source.email ?? "",
    specialty: source.specialty ?? "",
    experience: source.experience ?? "",
    description: source.description ?? "",
    specialties: source.specialties?.join(", ") ?? "",
    certifications: source.certifications?.join(", ") ?? "",
    fees: source.fees != null ? String(source.fees) : "",
    rating: source.rating != null ? String(source.rating) : "",
    clients: source.clients != null ? String(source.clients) : "",
    imageUrl: source.imageUrl ?? "",
  });

  useEffect(() => {
    if (trainer) {
      setFormState(fillFormFromTrainer(trainer));
    }
  }, [trainer]);

  const handleInputChange = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormState((previous) => ({ ...previous, [field]: value }));
    };

  const parseNumberField = (
    value: string,
    fallback: number | undefined,
    label: string,
    allowEmptyFallback = true
  ) => {
    const trimmed = value.trim();

    if (!trimmed) {
      if (allowEmptyFallback && typeof fallback === "number") {
        return fallback;
      }
      toast.error(`${label} is required`);
      throw new Error(`${label} missing`);
    }

    const parsed = Number(trimmed);

    if (Number.isNaN(parsed)) {
      toast.error(`${label} must be a valid number`);
      throw new Error(`${label} invalid`);
    }

    if (parsed < 0) {
      toast.error(`${label} cannot be negative`);
      throw new Error(`${label} negative`);
    }

    return parsed;
  };

  const toStringList = (value: string) =>
    value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

  const handleSave = () => {
    if (!trainerId) {
      toast.error("Complete your trainer profile before saving.");
      return;
    }

    try {
      if (!formState.name.trim() || !formState.email.trim()) {
        toast.error("Name and email are required");
        return;
      }

      if (!formState.specialty.trim() || !formState.description.trim()) {
        toast.error("Specialty and description are required");
        return;
      }

      const parsedFees = parseNumberField(formState.fees, trainer?.fees, "Fees", false);
      const parsedRating = parseNumberField(
        formState.rating,
        trainer?.rating,
        "Rating"
      );
      const parsedClients = parseNumberField(
        formState.clients,
        trainer?.clients,
        "Client count"
      );

      const payload: UpdateTrainer = {
        trainerID: trainerId,
        userID: trainer?.userID ?? userId,
        name: formState.name.trim(),
        email: formState.email.trim(),
        specialty: formState.specialty.trim(),
        experience: formState.experience.trim(),
        rating: parsedRating,
        clients: parsedClients,
        imageUrl: formState.imageUrl.trim() || null,
        certifications: toStringList(formState.certifications),
        description: formState.description.trim(),
        specialties: toStringList(formState.specialties),
        fees: parsedFees,
      };

      updateTrainerMutation.mutate(payload);
    } catch (error) {
      // Error messages already shown via toast in parseNumberField
    }
  };

  const handleReset = () => {
    if (trainer) {
      setFormState(fillFormFromTrainer(trainer));
    } else {
      setFormState(emptyFormState);
    }
  };

  const photoSrc = formState.imageUrl || trainer?.imageUrl || "";
  const hasCustomPhoto = Boolean(
    formState.imageUrl && formState.imageUrl !== (trainer?.imageUrl ?? "")
  );

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > MAX_PROFILE_PHOTO_SIZE) {
      toast.error("Image must be 5MB or smaller");
      event.target.value = "";
      return;
    }

    const isAllowedType = ALLOWED_PROFILE_PHOTO_TYPES.some(
      (mimeType) => file.type === mimeType
    );

    if (!isAllowedType) {
      toast.error("Only JPG and PNG images are supported");
      event.target.value = "";
      return;
    }

    uploadPhotoMutation.mutate(file);
    event.target.value = "";
  };

  const triggerPhotoUpload = () => {
    if (!isUploadingPhoto) {
      fileInputRef.current?.click();
    }
  };

  const handleRevertPhoto = () => {
    setFormState((previous) => ({
      ...previous,
      imageUrl: trainer?.imageUrl ?? "",
    }));
  };

  if (trainerQuery.isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (trainerQuery.isError) {
    return (
      <div className="container mx-auto flex h-80 max-w-3xl flex-col items-center justify-center gap-4 py-8 px-4 text-center">
        <p className="text-muted-foreground">
          We couldn’t load your trainer profile. Please try again.
        </p>
        <Button onClick={() => trainerQuery.refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="container mx-auto flex h-80 max-w-3xl flex-col items-center justify-center gap-4 py-8 px-4 text-center">
        <h2 className="text-xl font-semibold">Trainer profile not found</h2>
        <p className="text-muted-foreground text-sm">
          Complete your trainer onboarding to start managing your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Trainer Profile</h1>
        <p className="text-muted-foreground">
          Manage your professional profile and keep your information up to date.
        </p>
      </div>

      <Card className="shadow-card mb-6">
        <CardContent className="py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border bg-secondary/40">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={formState.name || "Trainer avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Profile photo</p>
              <p className="text-xs text-muted-foreground">
                Upload a square image (max 5MB). Supported formats: JPG, PNG.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={triggerPhotoUpload}
                  disabled={isUploadingPhoto}
                >
                  {isUploadingPhoto ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload new photo
                    </>
                  )}
                </Button>
                {hasCustomPhoto && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRevertPhoto}
                    disabled={isUploadingPhoto}
                  >
                    Revert
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name *</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={handleInputChange("name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={formState.email}
                  onChange={handleInputChange("email")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Primary specialty *</Label>
              <Input
                id="specialty"
                placeholder="e.g., Strength & HIIT Training"
                value={formState.specialty}
                onChange={handleInputChange("specialty")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                placeholder="e.g., 8 years"
                value={formState.experience}
                onChange={handleInputChange("experience")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Session fee ($) *</Label>
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
              <Label htmlFor="clients">Clients trained</Label>
              <Input
                id="clients"
                type="number"
                min="0"
                value={formState.clients}
                onChange={handleInputChange("clients")}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Professional bio *</Label>
              <Textarea
                id="description"
                rows={4}
                value={formState.description}
                onChange={handleInputChange("description")}
                placeholder="Share your story, coaching philosophy, and how you help clients succeed."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Textarea
                id="specialties"
                rows={3}
                value={formState.specialties}
                onChange={handleInputChange("specialties")}
                placeholder="Separate each specialty with a comma (e.g., Weight Loss, Muscle Building)"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                rows={3}
                value={formState.certifications}
                onChange={handleInputChange("certifications")}
                placeholder="Separate each certification with a comma"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerProfileView;
