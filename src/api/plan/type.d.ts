export type Plan = {
    planID: string,
    trainerID: string,
    planName: string,
    description: string,
    dailyCalories: number,
    dailyProtein: number,
    dailyCarbs: number,
    dailyFats: number,
    meals: meal[],
    assignedCount: number,
}

export type meal = {
    mealID: string,
    planID: string,
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fats: number,
    foods: string[],
}

export type AddMeal = {
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fats: number,
    foods: string[],
}

export type AddPlan = {
    trainerID: string,
    planName: string,
    description: string,
    dailyCalories: number,
    dailyProtein: number,
    dailyCarbs: number,
    dailyFats: number,
    meals: AddMeal[],
}

export type UpdateMeal = {
    mealID?: string,
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fats: number,
    foods: string[],
}

export type UpdatePlan = {
    planID: string,
    trainerID: string,
    planName: string,
    description: string,
    dailyCalories: number,
    dailyProtein: number,
    dailyCarbs: number,
    dailyFats: number,
    meals: UpdateMeal[],
}