// User roles
export type UserRole = "user" | "admin" | "trainer";

type UserCredentials = {
  name: string;
  email: string;
  role: UserRole;
};

type JwtPayload = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iat: number;
};

// User Profile
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePhoto?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  height?: number; // in cm
  weight?: number; // in kg
  fitnessGoals?: string[];
  preferences?: string[];
  subscriptionStatus?: "active" | "inactive" | "trial";
  subscriptionPlan?: string;
  membershipExpiry?: Date;
  createdAt: Date;
  lastWeightUpdate?: Date;
  totalWorkouts?: number;
}

// Booking & Session types
export type BookingStatus = "pending" | "approved" | "completed" | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  sessionId: string;
  bookingDate: Date;
  status: BookingStatus;
  notes?: string;
  sessionDetails?: ClassSession;
  createdAt?: Date;
  updatedAt?: Date;
}

// Trainer types
export interface Trainer {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  bio?: string;
  specializations: string[];
  certifications: string[];
  rating: number;
  totalRatings: number;
  yearsExperience: number;
  availability: TrainerAvailability[];
  hourlyRate?: number;
}

export interface TrainerAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TrainerRating {
  id: string;
  userId: string;
  trainerId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Diet Plan types
export type DietPlanType = "weight_loss" | "muscle_gain" | "mind_body_balance";
export type DietPlanAccess = "free_tutorial" | "private" | "food_box";

export interface DietPlan {
  id: string;
  name: string;
  type: DietPlanType;
  description: string;
  accessType: DietPlanAccess;
  trainerId?: string;
  userId?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  duration: number;
  price?: number;
}

// Progress Tracking
export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
  photos?: string[];
}

// Store types
// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   category: "equipment" | "supplement" | "apparel" | "accessory";
//   price: number;
//   stock: number;
//   images: string[];
//   rating: number;
// }

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

// Class Session extension
export interface ClassSession {
  id: string;
  classId: string;
  className: string;
  trainerId: string;
  trainerName: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  maxCapacity: number;
  currentBookings: number;
  isFree: boolean;
  price: number;
  location: string;
}

// Trainer-specific types
export interface Client {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  phone?: string;
  joinedDate: Date;
  activePrograms: number;
  completedSessions: number;
  currentWeight?: number;
  goalWeight?: number;
  assignedDietPlan?: string;
  notes?: string;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  clientId?: string;
  duration: number; // in weeks
  exercises: Exercise[];
  createdAt: Date;
  isTemplate: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  videoUrl?: string;
}

export interface Earning {
  id: string;
  trainerId: string;
  amount: number;
  source: "session" | "diet_plan" | "program";
  sourceId: string;
  clientName: string;
  date: Date;
  status: "pending" | "paid" | "cancelled";
}

export interface Review {
  id: string;
  trainerId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  response?: string;
}
