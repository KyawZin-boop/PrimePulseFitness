export type User = {
  userID: string;
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  imageUrl: string | null;
  subscriptionStatus: boolean;
  subscriptionPlan: string | null;
  membershipName: string | null;
  membershipDiscountPercentage: number;
  membershipEndDate: string | null;
  assignedDietPlan: string[];
  assignedWorkoutPlan: string[];
  createdAt: string;
  updatedAt: string;
  activeFlag: boolean;
};

export type UserResponse = {
  userID: string;
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
}

export type UpdateUser = {
  userID: string;
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  imageUrl: string | null;
};
