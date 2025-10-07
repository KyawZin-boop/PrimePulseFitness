import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, TrendingUp, User, Calendar, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Client } from "@/types";

const TrainerClientsView = () => {
  const navigate = useNavigate();

  // Mock clients - replace with API call
  const clients: Client[] = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      profilePhoto: "https://i.pravatar.cc/150?img=1",
      joinedDate: new Date("2025-01-15"),
      activePrograms: 2,
      completedSessions: 24,
      currentWeight: 82,
      goalWeight: 75,
      assignedDietPlan: "Lean Muscle Builder",
      notes: "Focus on strength training, recovering from knee injury",
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "+1 (555) 234-5678",
      profilePhoto: "https://i.pravatar.cc/150?img=5",
      joinedDate: new Date("2025-02-20"),
      activePrograms: 1,
      completedSessions: 18,
      currentWeight: 65,
      goalWeight: 60,
      assignedDietPlan: "Fat Loss Accelerator",
      notes: "Cardio enthusiast, preparing for marathon",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@example.com",
      phone: "+1 (555) 345-6789",
      profilePhoto: "https://i.pravatar.cc/150?img=12",
      joinedDate: new Date("2024-11-10"),
      activePrograms: 3,
      completedSessions: 48,
      currentWeight: 78,
      goalWeight: 80,
      assignedDietPlan: "Premium Food Box",
      notes: "Advanced lifter, focusing on muscle gain",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">My Clients</h1>
        <p className="text-muted-foreground">
          Manage your active clients and their progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card
            key={client.id}
            className="cursor-pointer shadow-card transition hover:shadow-athletic"
            onClick={() => navigate(`/trainer/clients/${client.id}`)}
          >
            <CardHeader>
              <div className="mb-4 flex items-start gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                  {client.profilePhoto ? (
                    <img
                      src={client.profilePhoto}
                      alt={client.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="truncate">{client.name}</CardTitle>
                  <CardDescription className="truncate">
                    {client.email}
                  </CardDescription>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Joined {client.joinedDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Dumbbell className="h-3 w-3" />
                    Programs
                  </div>
                  <div className="font-semibold">{client.activePrograms}</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Sessions
                  </div>
                  <div className="font-semibold">{client.completedSessions}</div>
                </div>
              </div>

              {client.currentWeight && client.goalWeight && (
                <div className="rounded-lg border bg-gradient-card p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Progress
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{client.currentWeight}kg</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-semibold text-accent">{client.goalWeight}kg</span>
                  </div>
                </div>
              )}

              {client.assignedDietPlan && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Diet Plan: </span>
                  <span className="font-medium">{client.assignedDietPlan}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trainer/messages?client=${client.id}`);
                  }}
                >
                  <Mail className="mr-1 h-3 w-3" />
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${client.phone}`;
                  }}
                >
                  <Phone className="mr-1 h-3 w-3" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Clients Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't been assigned any clients yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerClientsView;
