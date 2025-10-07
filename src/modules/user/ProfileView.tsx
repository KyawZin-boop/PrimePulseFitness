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
  Dumbbell,
  Save,
  Target,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import type { User } from "@/types";

const UserProfileView = () => {
  // Mock user data - replace with actual API call
  const [user, setUser] = useState<User>({
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "user",
    profilePhoto: undefined,
    age: 28,
    gender: "male",
    height: 175,
    weight: 75,
    fitnessGoals: ["Weight Loss", "Muscle Gain"],
    preferences: ["Strength Training", "Cardio"],
    subscriptionStatus: "active",
    subscriptionPlan: "Premium Monthly",
    membershipExpiry: new Date("2025-11-01"),
    createdAt: new Date("2024-01-15"),
    lastWeightUpdate: new Date("2025-10-01"),
    totalWorkouts: 48,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // API call to save user profile
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
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
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
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
            <div className="rounded-lg bg-accent/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent">
                <TrendingUp className="h-4 w-4" />
                Subscription
              </div>
              <p className="text-sm font-medium">{user.subscriptionPlan}</p>
              <p className="text-xs text-muted-foreground">
                Expires: {user.membershipExpiry?.toLocaleDateString()}
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
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={user.age || ""}
                    onChange={(e) =>
                      setUser({ ...user, age: parseInt(e.target.value) })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={user.gender || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        gender: e.target.value as "male" | "female" | "other",
                      })
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
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={user.height || ""}
                    onChange={(e) =>
                      setUser({ ...user, height: parseInt(e.target.value) })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={user.weight || ""}
                    onChange={(e) =>
                      setUser({ ...user, weight: parseInt(e.target.value) })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Goals */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Fitness Goals & Preferences
              </CardTitle>
              <CardDescription>
                Your fitness objectives and training preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {user.fitnessGoals?.map((goal) => (
                    <span
                      key={goal}
                      className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Training Preferences</Label>
                <div className="flex flex-wrap gap-2">
                  {user.preferences?.map((pref) => (
                    <span
                      key={pref}
                      className="rounded-full bg-secondary px-3 py-1 text-sm font-medium"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-accent" />
                Progress Overview
              </CardTitle>
              <CardDescription>Your recent fitness activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gradient-card p-4">
                  <div className="text-sm text-muted-foreground">
                    Current Weight
                  </div>
                  <div className="text-2xl font-bold">{user.weight} kg</div>
                  <div className="text-xs text-muted-foreground">
                    Updated {user.lastWeightUpdate?.toLocaleDateString()}
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-card p-4">
                  <div className="text-sm text-muted-foreground">
                    Total Workouts
                  </div>
                  <div className="text-2xl font-bold">{user.totalWorkouts}</div>
                  <div className="text-xs text-muted-foreground">
                    This month: 12
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-card p-4">
                  <div className="text-sm text-muted-foreground">
                    Member Since
                  </div>
                  <div className="text-2xl font-bold">
                    {user.createdAt.getFullYear()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
