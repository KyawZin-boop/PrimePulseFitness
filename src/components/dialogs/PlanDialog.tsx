import { ReactNode, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import type { Plan } from "@/api/plan/type";

type DialogMode = "create" | "edit";

type MealForm = {
  id: string;
  mealID?: string;
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  foods: string;
};

type CreatePlanDialogProps = {
  mode: DialogMode;
  plan?: Plan;
  trigger?: ReactNode;
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
};

const createEmptyMeal = (): MealForm => ({
  id: generateId(),
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  foods: "",
});

const toMealForm = (meal: Plan["meals"][number]): MealForm => ({
  id: generateId(),
  mealID: meal.mealID,
  name: meal.name,
  calories: meal.calories ? String(meal.calories) : "",
  protein: meal.protein ? String(meal.protein) : "",
  carbs: meal.carbs ? String(meal.carbs) : "",
  fats: meal.fats ? String(meal.fats) : "",
  foods: meal.foods.join(", "),
});

export const CreatePlanDialog = ({
  mode,
  plan,
  trigger,
}: CreatePlanDialogProps) => {
  const isEdit = mode === "edit";

  const [open, setOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [dailyCalories, setDailyCalories] = useState("");
  const [dailyProtein, setDailyProtein] = useState("");
  const [dailyCarbs, setDailyCarbs] = useState("");
  const [dailyFats, setDailyFats] = useState("");
  const [meals, setMeals] = useState<MealForm[]>([]);

  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const shouldFetchTrainer = !isEdit && Boolean(userId);
  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: shouldFetchTrainer,
  });

  const queryClient = useQueryClient();

  const trainerId = useMemo(() => {
    if (isEdit) {
      return plan?.trainerID ?? "";
    }

    return trainer?.trainerID ?? "";
  }, [isEdit, plan, trainer]);

  const invalidatePlansQuery = () => {
    if (!trainerId) {
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ["getPlanByTrainerId", trainerId],
    });
  };

  const createPlanMutation = api.plan.addNewPlan.useMutation({
    onSuccess: () => {
      toast.success("Diet plan created successfully!");
      handleClose();
      invalidatePlansQuery();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to create diet plan");
    },
  });

  const updatePlanMutation = api.plan.updatePlan.useMutation({
    onSuccess: () => {
      toast.success("Diet plan updated successfully!");
      handleClose();
      invalidatePlansQuery();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to update diet plan");
    },
  });

  const isSubmitting = createPlanMutation.isPending || updatePlanMutation.isPending;

  const resetForm = () => {
    setPlanName("");
    setPlanDescription("");
    setDailyCalories("");
    setDailyProtein("");
    setDailyCarbs("");
    setDailyFats("");
    setMeals([]);
  };

  const hydrateFromPlan = () => {
    if (!plan) {
      return;
    }

    setPlanName(plan.planName ?? "");
    setPlanDescription(plan.description ?? "");
    setDailyCalories(plan.dailyCalories ? String(plan.dailyCalories) : "");
    setDailyProtein(plan.dailyProtein ? String(plan.dailyProtein) : "");
    setDailyCarbs(plan.dailyCarbs ? String(plan.dailyCarbs) : "");
    setDailyFats(plan.dailyFats ? String(plan.dailyFats) : "");
    setMeals(plan.meals.map(toMealForm));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
      return;
    }

    if (isEdit) {
      hydrateFromPlan();
      return;
    }

    resetForm();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEdit) {
      hydrateFromPlan();
    }
  }, [open, isEdit, plan]);

  const handleMealChange = (mealId: string, field: keyof Omit<MealForm, "id" | "mealID">, value: string) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              [field]: value,
            }
          : meal
      )
    );
  };

  const handleAddMeal = () => {
    setMeals((prev) => [...prev, createEmptyMeal()]);
  };

  const handleRemoveMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
  };

  const parseNumber = (value: string) => {
    if (!value.trim()) {
      return 0;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? NaN : parsed;
  };

  const handleSubmit = () => {
    if (
      !planName.trim() ||
      !planDescription.trim() ||
      !dailyCalories.trim() ||
      !dailyProtein.trim() ||
      !dailyCarbs.trim() ||
      !dailyFats.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!trainerId) {
      toast.error("You must complete your trainer profile before managing plans.");
      return;
    }

    const calories = parseNumber(dailyCalories);
    const protein = parseNumber(dailyProtein);
    const carbs = parseNumber(dailyCarbs);
    const fats = parseNumber(dailyFats);

    if ([calories, protein, carbs, fats].some((macro) => Number.isNaN(macro))) {
      toast.error("Daily targets must be valid numbers");
      return;
    }

    let hasInvalidMealMacro = false;

    const normalizedMeals = meals.map((meal) => {
      const mealCalories = parseNumber(meal.calories);
      const mealProtein = parseNumber(meal.protein);
      const mealCarbs = parseNumber(meal.carbs);
      const mealFats = parseNumber(meal.fats);

      if ([mealCalories, mealProtein, mealCarbs, mealFats].some((macro) => Number.isNaN(macro))) {
        hasInvalidMealMacro = true;
      }

      const foods = meal.foods
        .split(",")
        .map((food) => food.trim())
        .filter(Boolean);

      return {
        mealID: meal.mealID,
        name: meal.name.trim(),
        calories: mealCalories,
        protein: mealProtein,
        carbs: mealCarbs,
        fats: mealFats,
        foods,
      };
    });

    if (hasInvalidMealMacro) {
      toast.error("Meal macros must be valid numbers");
      return;
    }

    if (normalizedMeals.some((meal) => !meal.name)) {
      toast.error("Meal names are required");
      return;
    }

    const basePayload = {
      trainerID: trainerId,
      planName: planName.trim(),
      description: planDescription.trim(),
      dailyCalories: calories,
      dailyProtein: protein,
      dailyCarbs: carbs,
      dailyFats: fats,
    };

    if (isEdit) {
      if (!plan) {
        toast.error("Unable to edit this plan");
        return;
      }

      updatePlanMutation.mutate({
        planID: plan.planID,
        ...basePayload,
        meals: normalizedMeals,
      });

      return;
    }

    createPlanMutation.mutate({
      ...basePayload,
      meals: normalizedMeals.map(({ mealID, ...meal }) => meal),
    });
  };

  const handleClose = () => {
    handleOpenChange(false);
  };

  const actionLabel = isEdit ? "Save Changes" : "Create Plan";
  const title = isEdit ? "Edit Diet Plan" : "Create New Diet Plan";
  const description = isEdit
    ? "Update your plan details and meals."
    : "Capture plan macros and meals to share with your clients.";

  const renderedTrigger = trigger ?? (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      {isEdit ? "Edit Plan" : "Create Plan"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{renderedTrigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name *</Label>
              <Input
                id="plan-name"
                placeholder="e.g., Lean Muscle Builder"
                value={planName}
                onChange={(event) => setPlanName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-calories">Daily Calories *</Label>
              <Input
                id="daily-calories"
                type="number"
                min="0"
                placeholder="e.g., 2400"
                value={dailyCalories}
                onChange={(event) => setDailyCalories(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-protein">Daily Protein (g) *</Label>
              <Input
                id="daily-protein"
                type="number"
                min="0"
                placeholder="e.g., 180"
                value={dailyProtein}
                onChange={(event) => setDailyProtein(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-carbs">Daily Carbs (g) *</Label>
              <Input
                id="daily-carbs"
                type="number"
                min="0"
                placeholder="e.g., 250"
                value={dailyCarbs}
                onChange={(event) => setDailyCarbs(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-fats">Daily Fats (g) *</Label>
              <Input
                id="daily-fats"
                type="number"
                min="0"
                placeholder="e.g., 70"
                value={dailyFats}
                onChange={(event) => setDailyFats(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-description">Description *</Label>
            <Textarea
              id="plan-description"
              placeholder="Outline the focus or goal of this nutrition plan"
              value={planDescription}
              onChange={(event) => setPlanDescription(event.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Meals</h3>
                <p className="text-xs text-muted-foreground">
                  Add meals with their macro breakdown and foods. Foods can be comma-separated.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddMeal}>
                <Plus className="mr-1 h-4 w-4" /> Add Meal
              </Button>
            </div>

            {meals.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No meals added yet. Click "Add Meal" to begin detailing the plan.
              </div>
            ) : (
              <div className="space-y-4">
                {meals.map((meal, index) => (
                  <div key={meal.id} className="rounded-lg border bg-secondary/30 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-semibold">Meal {index + 1}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMeal(meal.id)}
                        aria-label="Remove meal"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`meal-name-${meal.id}`}>Name *</Label>
                        <Input
                          id={`meal-name-${meal.id}`}
                          placeholder="e.g., Breakfast"
                          value={meal.name}
                          onChange={(event) => handleMealChange(meal.id, "name", event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`meal-calories-${meal.id}`}>Calories</Label>
                        <Input
                          id={`meal-calories-${meal.id}`}
                          type="number"
                          min="0"
                          placeholder="e.g., 600"
                          value={meal.calories}
                          onChange={(event) => handleMealChange(meal.id, "calories", event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`meal-protein-${meal.id}`}>Protein (g)</Label>
                        <Input
                          id={`meal-protein-${meal.id}`}
                          type="number"
                          min="0"
                          placeholder="e.g., 45"
                          value={meal.protein}
                          onChange={(event) => handleMealChange(meal.id, "protein", event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`meal-carbs-${meal.id}`}>Carbs (g)</Label>
                        <Input
                          id={`meal-carbs-${meal.id}`}
                          type="number"
                          min="0"
                          placeholder="e.g., 70"
                          value={meal.carbs}
                          onChange={(event) => handleMealChange(meal.id, "carbs", event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`meal-fats-${meal.id}`}>Fats (g)</Label>
                        <Input
                          id={`meal-fats-${meal.id}`}
                          type="number"
                          min="0"
                          placeholder="e.g., 20"
                          value={meal.fats}
                          onChange={(event) => handleMealChange(meal.id, "fats", event.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2 lg:col-span-3 space-y-2">
                        <Label htmlFor={`meal-foods-${meal.id}`}>Foods</Label>
                        <Textarea
                          id={`meal-foods-${meal.id}`}
                          placeholder="List foods separated by commas"
                          value={meal.foods}
                          onChange={(event) => handleMealChange(meal.id, "foods", event.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};