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
import { Apple, DollarSign, Flame, Target, TrendingDown, TrendingUp, Utensils } from "lucide-react";
import { useState } from "react";
import type { DietPlan, DietPlanType } from "@/types";
import { toast } from "sonner";

const DietPlansView = () => {
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<DietPlanType | "all">(
    "all"
  );

  // Mock diet plans - replace with API call
  const plans: DietPlan[] = [
    {
      id: "plan-1",
      name: "Lean Muscle Builder",
      type: "muscle_gain",
      description:
        "High-protein meal plan designed to support muscle growth and recovery. Includes optimal macros for strength training.",
      accessType: "private",
      trainerId: "trainer-1",
      calories: 2800,
      protein: 200,
      carbs: 300,
      fats: 80,
      duration: 30,
      price: 89,
    },
    {
      id: "plan-2",
      name: "Fat Loss Accelerator",
      type: "weight_loss",
      description:
        "Calorie-controlled nutrition plan for sustainable weight loss while preserving lean muscle mass.",
      accessType: "private",
      trainerId: "trainer-2",
      calories: 1800,
      protein: 140,
      carbs: 150,
      fats: 60,
      duration: 30,
      price: 79,
    },
    {
      id: "plan-3",
      name: "Beginner Nutrition Guide",
      type: "mind_body_balance",
      description:
        "Free comprehensive guide to balanced nutrition for overall wellness and energy.",
      accessType: "free_tutorial",
      calories: 2200,
      protein: 120,
      carbs: 250,
      fats: 70,
      duration: 14,
      price: 0,
    },
    {
      id: "plan-4",
      name: "Premium Food Box",
      type: "muscle_gain",
      description:
        "Pre-portioned meals delivered to your door. Hassle-free nutrition tailored to your goals.",
      accessType: "food_box",
      calories: 2500,
      protein: 180,
      carbs: 280,
      fats: 75,
      duration: 30,
      price: 299,
    },
    {
      id: "plan-5",
      name: "Mindful Balance Plan",
      type: "mind_body_balance",
      description:
        "Holistic nutrition approach focusing on whole foods, stress reduction, and sustainable habits.",
      accessType: "private",
      trainerId: "trainer-3",
      calories: 2000,
      protein: 110,
      carbs: 220,
      fats: 65,
      duration: 30,
      price: 75,
    },
  ];

  const filteredPlans =
    selectedFilter === "all"
      ? plans
      : plans.filter((p) => p.type === selectedFilter);

  const handleEnroll = (plan: DietPlan) => {
    // API call to enroll in plan
    toast.success(`Enrolled in ${plan.name}!`);
    setSelectedPlan(null);
  };

  const getPlanTypeColor = (type: DietPlanType) => {
    switch (type) {
      case "muscle_gain":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "weight_loss":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "mind_body_balance":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-secondary";
    }
  };

  const getPlanTypeIcon = (type: DietPlanType) => {
    switch (type) {
      case "muscle_gain":
        return <TrendingUp className="h-4 w-4" />;
      case "weight_loss":
        return <TrendingDown className="h-4 w-4" />;
      case "mind_body_balance":
        return <Target className="h-4 w-4" />;
    }
  };

  const getAccessBadge = (accessType: string) => {
    switch (accessType) {
      case "free_tutorial":
        return (
          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
            FREE
          </span>
        );
      case "food_box":
        return (
          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-500">
            FOOD BOX
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Diet Plans</h1>
        <p className="text-muted-foreground">
          Personalized nutrition plans to fuel your fitness journey
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          onClick={() => setSelectedFilter("all")}
        >
          All Plans
        </Button>
        <Button
          variant={selectedFilter === "muscle_gain" ? "default" : "outline"}
          onClick={() => setSelectedFilter("muscle_gain")}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Muscle Gain
        </Button>
        <Button
          variant={selectedFilter === "weight_loss" ? "default" : "outline"}
          onClick={() => setSelectedFilter("weight_loss")}
        >
          <TrendingDown className="mr-2 h-4 w-4" />
          Weight Loss
        </Button>
        <Button
          variant={selectedFilter === "mind_body_balance" ? "default" : "outline"}
          onClick={() => setSelectedFilter("mind_body_balance")}
        >
          <Target className="mr-2 h-4 w-4" />
          Balance
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <Card
            key={plan.id}
            className="shadow-card transition hover:shadow-athletic cursor-pointer"
            onClick={() => setSelectedPlan(plan)}
          >
            <CardHeader>
              <div className="mb-2 flex items-start justify-between">
                <span
                  className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getPlanTypeColor(
                    plan.type
                  )}`}
                >
                  {getPlanTypeIcon(plan.type)}
                  {plan.type.replace("_", " ").toUpperCase()}
                </span>
                {getAccessBadge(plan.accessType)}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Macros */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="h-3 w-3" />
                    Calories
                  </div>
                  <div className="font-semibold">{plan.calories}</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Apple className="h-3 w-3" />
                    Protein
                  </div>
                  <div className="font-semibold">{plan.protein}g</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Utensils className="h-3 w-3" />
                    Carbs
                  </div>
                  <div className="font-semibold">{plan.carbs}g</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Fats
                  </div>
                  <div className="font-semibold">{plan.fats}g</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {plan.duration} days
                </span>
                <span className="text-lg font-bold text-accent">
                  {plan.price === 0 ? "FREE" : `$${plan.price}`}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Detail Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
                  selectedPlan ? getPlanTypeColor(selectedPlan.type) : ""
                }`}
              >
                {selectedPlan && getPlanTypeIcon(selectedPlan.type)}
                {selectedPlan?.type.replace("_", " ").toUpperCase()}
              </span>
              {selectedPlan && getAccessBadge(selectedPlan.accessType)}
            </div>
            <DialogTitle className="text-2xl">{selectedPlan?.name}</DialogTitle>
            <DialogDescription className="text-base">
              {selectedPlan?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6">
              {/* Macro Breakdown */}
              <div>
                <h3 className="mb-3 font-semibold">Daily Macronutrients</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="rounded-lg bg-gradient-card p-4 text-center">
                    <Flame className="mx-auto mb-2 h-5 w-5 text-accent" />
                    <div className="text-2xl font-bold">
                      {selectedPlan.calories}
                    </div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                  <div className="rounded-lg bg-gradient-card p-4 text-center">
                    <Apple className="mx-auto mb-2 h-5 w-5 text-accent" />
                    <div className="text-2xl font-bold">
                      {selectedPlan.protein}g
                    </div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="rounded-lg bg-gradient-card p-4 text-center">
                    <Utensils className="mx-auto mb-2 h-5 w-5 text-accent" />
                    <div className="text-2xl font-bold">
                      {selectedPlan.carbs}g
                    </div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div className="rounded-lg bg-gradient-card p-4 text-center">
                    <div className="text-2xl font-bold">{selectedPlan.fats}g</div>
                    <div className="text-xs text-muted-foreground">Fats</div>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div className="rounded-lg border bg-secondary/30 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{selectedPlan.duration} days</span>
                </div>
                {selectedPlan.trainerId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created by:</span>
                    <span className="font-medium">Professional Trainer</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Access Type:</span>
                  <span className="font-medium capitalize">
                    {selectedPlan.accessType.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Price:</span>
                  <span className="text-xl font-bold text-accent">
                    {selectedPlan.price === 0 ? "FREE" : `$${selectedPlan.price}`}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleEnroll(selectedPlan)}
                  className="flex-1"
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DietPlansView;
