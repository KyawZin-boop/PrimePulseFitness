import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Apple,
  Save,
  Dumbbell,
  User as UserIcon,
  LogIn,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import api from "@/api";
import { toast } from "sonner";

const UserProfileView = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userCredentials } = useAuth();
  const userId = userCredentials?.userId || "";

  // Get user data from API
  const { data: user, isLoading, refetch } = api.user.getUserById.useQuery(userId);

  // Update user mutation
  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    },
  });

  // Upload file mutation
  const uploadFileMutation = api.files.uploadFile.useMutation({
    onSuccess: (fileUrl) => {
      toast.dismiss();
      // After successful upload, update user with new image URL
      if (user) {
        updateUserMutation.mutate({
          userID: user.userID,
          name: editedUser.name || user.name,
          email: editedUser.email || user.email,
          age: editedUser.age !== null ? editedUser.age : user.age,
          gender: editedUser.gender || user.gender,
          imageUrl: fileUrl, // Use the returned file URL
        });
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Failed to upload photo");
      console.error("Upload error:", error);
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    age: null as number | null,
    gender: null as string | null,
  });

  // Update editedUser when user data loads or changes
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;

    updateUserMutation.mutate({
      userID: user.userID,
      name: editedUser.name,
      email: editedUser.email,
      age: editedUser.age,
      gender: editedUser.gender,
      imageUrl: user.imageUrl,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      toast.loading("Uploading photo...");
      uploadFileMutation.mutate(file);
    }
  };

  // If user is not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="mb-8">
          <h1 className="text-heading mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and fitness journey
          </p>
        </div>

        <Card className="shadow-card max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-6">
              <UserIcon className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Login Required</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Please log in to view and manage your profile
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/auth/login")} size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")} 
                size="lg"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-8 px-4 pt-24">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-24">
      <div className="mb-8">
        <h1 className="text-heading mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and fitness journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Profile Photo Section */}
        <Card className="h-fit shadow-card">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4 h-40 w-40">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary">
                  <UserIcon className="h-20 w-20 text-muted-foreground" />
                </div>
              )}
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-accent p-2 text-white shadow-lg transition hover:bg-accent/90"
              >
                <Camera className="h-5 w-5" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.subscriptionStatus && (
              <div className="rounded-lg bg-accent/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent">
                  <Calendar className="h-4 w-4" />
                  Subscription
                </div>
                <p className="text-sm font-medium">
                  {user.subscriptionPlan || "Active Membership"}
                </p>
                <p className="text-xs text-muted-foreground">Status: Active</p>
              </div>
            )}
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="text-xs text-muted-foreground mb-2">Member Since</div>
              <p className="text-sm font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Your basic profile details</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={isEditing ? editedUser.name : user.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedUser.email : user.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={isEditing ? (editedUser.age || "") : (user.age || "")}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, age: e.target.value ? parseInt(e.target.value) : null })
                    }
                    disabled={!isEditing}
                    placeholder="Enter your age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={isEditing ? (editedUser.gender || "") : (user.gender || "")}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, gender: e.target.value || null })
                    }
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Plans */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-accent" />
                Assigned Programs
              </CardTitle>
              <CardDescription>
                Your current workout and diet plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.assignedWorkoutPlan && user.assignedWorkoutPlan.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    Workout Plans
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {user.assignedWorkoutPlan.map((plan, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
                      >
                        {plan}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {user.assignedDietPlan && user.assignedDietPlan.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Apple className="h-4 w-4" />
                    Diet Plans
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {user.assignedDietPlan.map((plan, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600"
                      >
                        {plan}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(!user.assignedWorkoutPlan || user.assignedWorkoutPlan.length === 0) && 
               (!user.assignedDietPlan || user.assignedDietPlan.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No plans assigned yet. Contact a trainer to get started!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
