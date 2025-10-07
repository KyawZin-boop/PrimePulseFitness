import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Award, CheckCircle, XCircle, Star } from "lucide-react";
import { toast } from "sonner";

interface TrainerApplication {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specializations: string[];
  certifications: string[];
  experience: number;
  status: "pending" | "approved" | "rejected";
  rating?: number;
  totalClients?: number;
  totalSessions?: number;
  monthlyEarnings?: number;
  appliedDate: Date;
}

const AdminTrainersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trainers, setTrainers] = useState<TrainerApplication[]>([
    {
      id: "1",
      name: "Mike Chen",
      email: "mike.chen@example.com",
      phone: "+1 (555) 345-6789",
      specializations: ["Strength Training", "Bodybuilding"],
      certifications: ["NASM-CPT", "NSCA-CSCS"],
      experience: 5,
      status: "approved",
      rating: 4.8,
      totalClients: 24,
      totalSessions: 156,
      monthlyEarnings: 4500,
      appliedDate: new Date("2024-06-15"),
    },
    {
      id: "2",
      name: "Emma Davis",
      email: "emma.davis@example.com",
      specializations: ["Yoga", "Pilates", "Flexibility"],
      certifications: ["RYT-200"],
      experience: 3,
      status: "pending",
      appliedDate: new Date("2025-10-01"),
    },
    {
      id: "3",
      name: "James Wilson",
      email: "james.w@example.com",
      phone: "+1 (555) 456-7890",
      specializations: ["HIIT", "Cardio", "Weight Loss"],
      certifications: ["ACE-CPT"],
      experience: 4,
      status: "approved",
      rating: 4.6,
      totalClients: 18,
      totalSessions: 98,
      monthlyEarnings: 3200,
      appliedDate: new Date("2024-09-20"),
    },
  ]);

  const handleApproveTrainer = (trainerId: string) => {
    setTrainers(
      trainers.map((t) =>
        t.id === trainerId ? { ...t, status: "approved" as const } : t
      )
    );
    toast.success("Trainer application approved!");
  };

  const handleRejectTrainer = (trainerId: string) => {
    setTrainers(
      trainers.map((t) =>
        t.id === trainerId ? { ...t, status: "rejected" as const } : t
      )
    );
    toast.error("Trainer application rejected");
  };

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTrainers = filteredTrainers.filter((t) => t.status === "pending");
  const approvedTrainers = filteredTrainers.filter((t) => t.status === "approved");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Trainer Management</h1>
        <p className="text-muted-foreground">
          Manage trainer applications and performance
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search trainers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Pending Applications */}
      {pendingTrainers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Pending Applications ({pendingTrainers.length})
          </h2>
          <div className="space-y-4">
            {pendingTrainers.map((trainer) => (
              <Card key={trainer.id} className="shadow-card">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{trainer.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                          Pending Review
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {trainer.email} {trainer.phone && `• ${trainer.phone}`}
                      </p>

                      <div className="grid gap-3 md:grid-cols-2 mb-3">
                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-xs text-muted-foreground mb-1">
                            Specializations
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {trainer.specializations.map((spec, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-lg bg-secondary/50 p-3">
                          <div className="text-xs text-muted-foreground mb-1">
                            Certifications
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {trainer.certifications.map((cert, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 flex items-center gap-1"
                              >
                                <Award className="h-3 w-3" />
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {trainer.experience} years of experience • Applied{" "}
                        {trainer.appliedDate.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveTrainer(trainer.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectTrainer(trainer.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Trainers */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Active Trainers ({approvedTrainers.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {approvedTrainers.map((trainer) => (
            <Card key={trainer.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{trainer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {trainer.specializations.join(" • ")}
                    </p>
                  </div>
                  {trainer.rating && (
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-semibold">{trainer.rating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <div className="text-xs text-muted-foreground">Clients</div>
                    <div className="font-bold">{trainer.totalClients || 0}</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <div className="text-xs text-muted-foreground">Sessions</div>
                    <div className="font-bold">{trainer.totalSessions || 0}</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <div className="text-xs text-muted-foreground">Revenue</div>
                    <div className="font-bold text-sm">
                      ${(trainer.monthlyEarnings || 0) / 1000}k
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {trainer.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600"
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTrainersView;
