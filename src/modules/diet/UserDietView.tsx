import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Flame, Activity, Beef, Utensils, Loader2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getPlanByUserId } from "@/api/plan";

const UserDietView = () => {
  const { userCredentials } = useAuth();

  // Fetch user's assigned diet plans directly
  const { data: assignedPlans = [], isLoading } = getPlanByUserId.useQuery(
    userCredentials?.userId || ""
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!assignedPlans || assignedPlans.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="mb-8">
          <h1 className="text-heading mb-2">My Diet Plans</h1>
          <p className="text-muted-foreground">Your personalized nutrition plans</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-6">
              <Apple className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-semibold text-xl mb-2">No Diet Plans Assigned</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              You don't have any diet plans yet. Contact a trainer to get a personalized nutrition plan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8">
        <h1 className="text-heading mb-2">My Diet Plans</h1>
        <p className="text-muted-foreground">Your personalized nutrition plans</p>
      </div>

      <div className="space-y-6">
        {assignedPlans.map((plan) => (
          <Card key={plan.planID} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{plan.planName}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                  <Utensils className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{plan.meals.length} Meals</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Daily Macros Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="text-sm text-muted-foreground">Calories</span>
                    </div>
                    <div className="text-2xl font-bold">{plan.dailyCalories}</div>
                    <p className="text-xs text-muted-foreground">kcal/day</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Beef className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-muted-foreground">Protein</span>
                    </div>
                    <div className="text-2xl font-bold">{plan.dailyProtein}g</div>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Apple className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">Carbs</span>
                    </div>
                    <div className="text-2xl font-bold">{plan.dailyCarbs}g</div>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Fats</span>
                    </div>
                    <div className="text-2xl font-bold">{plan.dailyFats}g</div>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </CardContent>
                </Card>
              </div>

              {/* Meals */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Meal Plan</h3>
                <div className="space-y-4">
                  {plan.meals.map((meal, index) => (
                    <Card key={meal.mealID} className="bg-secondary/30">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold text-sm">
                                {index + 1}
                              </span>
                              <h4 className="text-lg font-semibold">{meal.name}</h4>
                            </div>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              {meal.calories} kcal
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Protein</div>
                            <div className="font-semibold">{meal.protein}g</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Carbs</div>
                            <div className="font-semibold">{meal.carbs}g</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Fats</div>
                            <div className="font-semibold">{meal.fats}g</div>
                          </div>
                        </div>

                        {meal.foods && meal.foods.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Foods:</div>
                            <div className="flex flex-wrap gap-2">
                              {meal.foods.map((food, foodIndex) => (
                                <span
                                  key={foodIndex}
                                  className="bg-background px-3 py-1 rounded-full text-sm border"
                                >
                                  {food}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserDietView;
