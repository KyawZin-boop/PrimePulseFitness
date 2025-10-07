import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Save } from "lucide-react";
import { toast } from "sonner";

const TrainerProfileView = () => {
  const [profile, setProfile] = useState({
    name: "John Trainer",
    email: "john.trainer@primepulse.com",
    phone: "+1 (555) 123-4567",
    bio: "Certified personal trainer with 10+ years of experience. Specializing in strength training and sports performance.",
    specializations: "Strength Training, HIIT, Sports Performance, Nutrition",
    hourlyRate: "75",
    yearsExperience: "10",
    location: "New York, NY",
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Trainer Profile</h1>
        <p className="text-muted-foreground">
          Manage your professional profile and settings
        </p>
      </div>

      <Card className="shadow-card mb-6">
        <CardContent className="py-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="h-24 w-24 rounded-full bg-gradient-card flex items-center justify-center">
              <User className="h-12 w-12 text-accent" />
            </div>
            <div>
              <Button variant="outline">Upload Photo</Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <textarea
                id="bio"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={profile.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="specializations">Specializations</Label>
              <Input
                id="specializations"
                placeholder="e.g., Strength Training, HIIT, Nutrition"
                value={profile.specializations}
                onChange={(e) =>
                  handleChange("specializations", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Hourly Rate ($)</Label>
              <Input
                id="rate"
                type="number"
                value={profile.hourlyRate}
                onChange={(e) => handleChange("hourlyRate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={profile.yearsExperience}
                onChange={(e) =>
                  handleChange("yearsExperience", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerProfileView;
