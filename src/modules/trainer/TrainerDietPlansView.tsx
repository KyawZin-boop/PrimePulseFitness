import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: string[];
}

interface DietPlan {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFats: number;
  meals: Meal[];
  assignedClients: number;
  createdAt: Date;
}

const TrainerDietPlansView = () => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([
    {
      id: "1",
      name: "Lean Muscle Builder",
      description: "High protein, moderate carb diet for muscle growth",
      dailyCalories: 2800,
      dailyProtein: 200,
      dailyCarbs: 280,
      dailyFats: 80,
      meals: [
        {
          id: "m1",
          name: "Breakfast",
          calories: 650,
          protein: 45,
          carbs: 60,
          fats: 20,
          foods: ["Oatmeal", "Eggs", "Banana", "Protein shake"],
        },
        {
          id: "m2",
          name: "Lunch",
          calories: 850,
          protein: 60,
          carbs: 80,
          fats: 25,
          foods: ["Grilled chicken", "Brown rice", "Vegetables", "Olive oil"],
        },
        {
          id: "m3",
          name: "Dinner",
          calories: 750,
          protein: 55,
          carbs: 70,
          fats: 20,
          foods: ["Salmon", "Sweet potato", "Broccoli", "Quinoa"],
        },
        {
          id: "m4",
          name: "Snacks",
          calories: 550,
          protein: 40,
          carbs: 70,
          fats: 15,
          foods: ["Greek yogurt", "Almonds", "Apple", "Protein bar"],
        },
      ],
      assignedClients: 5,
      createdAt: new Date("2025-04-10"),
    },
    {
      id: "2",
      name: "Fat Loss Accelerator",
      description: "Calorie deficit with high protein to preserve muscle",
      dailyCalories: 1800,
      dailyProtein: 150,
      dailyCarbs: 150,
      dailyFats: 60,
      meals: [
        {
          id: "m5",
          name: "Breakfast",
          calories: 400,
          protein: 35,
          carbs: 30,
          fats: 15,
          foods: ["Egg whites", "Whole grain toast", "Berries"],
        },
        {
          id: "m6",
          name: "Lunch",
          calories: 550,
          protein: 50,
          carbs: 45,
          fats: 18,
          foods: ["Turkey breast", "Mixed greens", "Quinoa", "Avocado"],
        },
        {
          id: "m7",
          name: "Dinner",
          calories: 500,
          protein: 45,
          carbs: 40,
          fats: 15,
          foods: ["White fish", "Vegetables", "Brown rice"],
        },
        {
          id: "m8",
          name: "Snacks",
          calories: 350,
          protein: 20,
          carbs: 35,
          fats: 12,
          foods: ["Protein shake", "Almonds", "Apple"],
        },
      ],
      assignedClients: 8,
      createdAt: new Date("2025-03-15"),
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [newDailyCalories, setNewDailyCalories] = useState("");

  const handleCreatePlan = () => {
    if (!newPlanName || !newPlanDescription || !newDailyCalories) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newPlan: DietPlan = {
      id: `plan-${Date.now()}`,
      name: newPlanName,
      description: newPlanDescription,
      dailyCalories: parseInt(newDailyCalories),
      dailyProtein: 0,
      dailyCarbs: 0,
      dailyFats: 0,
      meals: [],
      assignedClients: 0,
      createdAt: new Date(),
    };

    setDietPlans([newPlan, ...dietPlans]);
    toast.success("Diet plan created successfully!");
    setIsCreateOpen(false);
    setNewPlanName("");
    setNewPlanDescription("");
    setNewDailyCalories("");
  };

  const handleDeletePlan = (planId: string) => {
    setDietPlans(dietPlans.filter((p) => p.id !== planId));
    toast.success("Diet plan deleted");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Diet Plans</h1>
          <p className="text-muted-foreground">
            Create and manage nutrition plans for your clients
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Diet Plan</DialogTitle>
              <DialogDescription>
                Start building a custom nutrition plan for your clients
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name *</Label>
                <Input
                  id="plan-name"
                  placeholder="e.g., Lean Muscle Builder"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-description">Description *</Label>
                <Input
                  id="plan-description"
                  placeholder="Brief description of the plan"
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-calories">Daily Calories Target *</Label>
                <Input
                  id="daily-calories"
                  type="number"
                  placeholder="e.g., 2500"
                  value={newDailyCalories}
                  onChange={(e) => setNewDailyCalories(e.target.value)}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                You can add meals and macros after creating the plan
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePlan}>Create Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {dietPlans.map((plan) => (
          <Card key={plan.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {plan.assignedClients} clients assigned
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Daily Totals */}
              <div className="mb-4 rounded-lg bg-gradient-card p-4">
                <div className="text-sm font-semibold mb-2">Daily Targets</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                    <div className="font-bold text-accent">
                      {plan.dailyCalories}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                    <div className="font-bold">{plan.dailyProtein}g</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                    <div className="font-bold">{plan.dailyCarbs}g</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Fats</div>
                    <div className="font-bold">{plan.dailyFats}g</div>
                  </div>
                </div>
              </div>

              {/* Meals */}
              {plan.meals.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-semibold">
                    Meals ({plan.meals.length})
                  </div>
                  {plan.meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="rounded-lg border bg-secondary/30 p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-sm">{meal.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {meal.calories} cal
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {meal.foods.join(" • ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  Edit Plan
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  Assign to Client
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {dietPlans.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Plus className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Diet Plans Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first nutrition plan to assign to clients
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerDietPlansView;
