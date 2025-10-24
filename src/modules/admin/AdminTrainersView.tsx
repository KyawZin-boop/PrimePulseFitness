import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getAllTrainers,
  addNewTrainer,
  suspendTrainer,
  activateTrainer,
} from "@/api/trainer";
import { getAllUsers } from "@/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "@/api/files";

const AdminTrainersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateFromUser, setShowCreateFromUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [clients, setClients] = useState<number>(0);
  const [certificationsInput, setCertificationsInput] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [specialtiesInput, setSpecialtiesInput] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const trainersQuery = getAllTrainers.useQuery();
  const usersQuery = getAllUsers.useQuery();

  const createTrainerMutation = addNewTrainer.useMutation({
    onSuccess: () => {
      toast.success("Trainer created");
      queryClient.invalidateQueries({ queryKey: ["getAllTrainers"] });
      setShowCreateFromUser(false);
      setSelectedUserId(null);
    },
    onError: () => toast.error("Failed to create trainer"),
  });

  const uploadMutation = uploadFile.useMutation();

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Trainer Management</h1>
          <p className="text-muted-foreground">
            Manage trainer applications and performance
          </p>
        </div>
        <div>
          <Button onClick={() => setShowCreateFromUser((s) => !s)}>
            Create Trainer from User
          </Button>
        </div>
      </div>

      {/* Create from user panel */}
      {showCreateFromUser && (
        <Card className="mb-6">
          <CardContent>
            <div className="mb-3">
              <Input
                placeholder="Filter users by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {usersQuery.isLoading && <div>Loading users...</div>}
            {usersQuery.isError && (
              <div className="text-destructive">Failed to load users</div>
            )}

            <div className="space-y-2 max-h-64 overflow-auto">
              {(usersQuery.data || [])
                .filter(
                  (u: any) =>
                    (u.name ?? "")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    (u.email ?? "")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((u: any) => (
                  <div
                    key={u.userID}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {u.email}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedUserId(u.userID)}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="athletic"
                        onClick={() => {
                          const payload = {
                            userID: u.userID,
                            name: u.name,
                            email: u.email,
                            specialty: "General",
                            experience: "0",
                            rating: 0,
                            clients: 0,
                            imageUrl: null,
                            certifications: [],
                            description: "",
                            specialties: [],
                          };
                          createTrainerMutation.mutate(payload);
                        }}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                ))}
            </div>

            {selectedUserId && (
              <div className="mt-3">
                <h3 className="font-semibold mb-2">
                  Create trainer for selected user
                </h3>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm">Name</label>
                    <Input
                      value={
                        (usersQuery.data || []).find(
                          (x: any) => x.userID === selectedUserId
                        )?.name || ""
                      }
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="text-sm">Email</label>
                    <Input
                      value={
                        (usersQuery.data || []).find(
                          (x: any) => x.userID === selectedUserId
                        )?.email || ""
                      }
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="text-sm">Specialty</label>
                    <Input
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm">Experience</label>
                    <Input
                      placeholder="e.g., 3 years"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm">Rating</label>
                    <Input
                      type="number"
                      value={String(rating)}
                      onChange={(e) => setRating(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="text-sm">Clients</label>
                    <Input
                      type="number"
                      value={String(clients)}
                      onChange={(e) => setClients(Number(e.target.value))}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm">
                      Certifications (comma separated)
                    </label>
                    <Input
                      value={certificationsInput}
                      onChange={(e) => setCertificationsInput(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm">
                      Specialties (comma separated)
                    </label>
                    <Input
                      value={specialtiesInput}
                      onChange={(e) => setSpecialtiesInput(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm">Profile image</label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setImageFile(f);
                        setImagePreview(f ? URL.createObjectURL(f) : null);
                      }}
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                      >
                        Choose image
                      </Button>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={async () => {
                      const u = (usersQuery.data || []).find(
                        (x: any) => x.userID === selectedUserId
                      );
                      if (!u) return toast.error("Selected user not found");
                      if (!specialty)
                        return toast.error("Specialty is required");

                      try {
                        let imageUrl: string | null = null;
                        if (imageFile) {
                          imageUrl = await uploadMutation.mutateAsync(
                            imageFile as File
                          );
                        }

                        const payload = {
                          userID: u.userID,
                          name: u.name,
                          email: u.email,
                          specialty,
                          experience,
                          rating,
                          clients,
                          imageUrl,
                          certifications: certificationsInput
                            ? certificationsInput
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            : [],
                          description,
                          specialties: specialtiesInput
                            ? specialtiesInput
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            : [],
                        };

                        createTrainerMutation.mutate(payload as any);
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to upload image or create trainer");
                      }
                    }}
                    disabled={
                      (createTrainerMutation as any).isLoading ||
                      (uploadMutation as any).isLoading
                    }
                  >
                    {(createTrainerMutation as any).isLoading ||
                    (uploadMutation as any).isLoading
                      ? "Creating..."
                      : "Create Trainer"}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setSelectedUserId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
