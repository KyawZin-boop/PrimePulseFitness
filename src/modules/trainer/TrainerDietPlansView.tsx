import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import { CreatePlanDialog } from "@/components/dialogs/PlanDialog";
import { AssignPlanDialog } from "@/components/dialogs/AssignPlanDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TrainerDietPlansView = () => {
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: Boolean(userId),
  });
  const trainerId = trainer?.trainerID ?? "";

  const plansQuery = api.plan.getPlanByTrainerId.useQuery(trainerId, {
    enabled: Boolean(trainerId),
  });
  const dietPlans = plansQuery.data ?? [];
  const showEmptyState = Boolean(trainerId) && !plansQuery.isLoading && dietPlans.length === 0;
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [clickDelete, setClickDelete] = useState(false);

  const deletePlanMutation = api.plan.deletePlan.useMutation({
    onSuccess: () => {
      toast.success("Diet plan deleted");
      plansQuery.refetch();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to delete plan");
    },
    onSettled: () => {
      setDeletingPlanId(null);
    },
  });

  const handleDeletePlan = (planId: string) => {
    if (!planId || deletePlanMutation.isPending) {
      return;
    }

    setDeletingPlanId(planId);
    setClickDelete(true);
    // deletePlanMutation.mutate(planId, {
    //   onSettled: () => setDeletingPlanId(null),
    // });
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
        <CreatePlanDialog
          mode="create"
          trigger={
            <Button disabled={!trainerId}>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {dietPlans.map((plan) => (
          <Card key={plan.planID} className="shadow-card">
            <CardHeader className="min-h-[90px]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{plan.planName}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {plan.assignedCount} clients assigned
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeletePlan(plan.planID)}
                  disabled={deletePlanMutation.isPending && deletingPlanId === plan.planID}
                >
                  {deletePlanMutation.isPending && deletingPlanId === plan.planID ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
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
                <div className="space-y-2 mb-4 flex-1">
                  <div className="text-sm font-semibold">
                    Meals ({plan.meals.length})
                  </div>
                  {plan.meals.map((meal) => (
                    <div
                      key={meal.mealID}
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
                <CreatePlanDialog
                  mode="edit"
                  plan={plan}
                  trigger={
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      disabled={deletePlanMutation.isPending && deletingPlanId === plan.planID}
                    >
                      Edit Plan
                    </Button>
                  }
                />
                <AssignPlanDialog
                  plan={plan}
                  disabled={
                    deletePlanMutation.isPending && deletingPlanId === plan.planID
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={clickDelete} onOpenChange={setClickDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deleting Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this plan?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant={"destructive"}
              onClick={() => {
                deletePlanMutation.mutate(deletingPlanId as string);
                setClickDelete(false);
              }}
            >
              Yes, Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setClickDelete(false);
                setDeletingPlanId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showEmptyState && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Plus className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Diet Plans Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first nutrition plan to assign to clients
            </p>
            <CreatePlanDialog
              mode="create"
              trigger={
                <Button disabled={!trainerId}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Plan
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerDietPlansView;
