type Trainer = {
  trainerID: string;
  userID: string;
  name: string;
  email: string;
  specialty: string;
  experience: string;
  rating: number;
  clients: number;
  imageUrl: string | null;
  certifications: string[];
  description: string;
  specialties: string[];
  fees: number;
  createdAt: Date;
  updatedAt: Date;
  activeFlag: boolean;
};

type AddTrainer = {
  name: string;
  email: string;
  specialty: string;
  experience: string;
  rating: number;
  clients: number;
  imageUrl: string | null;
  certifications: string[];
  description: string;
  specialties: string[];
  fees: number;
};

type UpdateTrainer = {
  trainerID: string;
  userID: string;
  name: string;
  email: string;
  specialty: string;
  experience: string;
  rating: number;
  clients: number;
  imageUrl: string | null;
  certifications: string[];
  description: string;
  specialties: string[];
  fees: number;
};

type Client = {
  clientID: string;
  userID: string;
  trainerID: string;
  bookingID: string;
  name: string;
  email: string;
  gender: string | null;
  joinedDate: Date;
  currentWeight: number | null;
  goalWeight: number | null;
  assignedDietPlan: string;
  assignedDietPlanID: string | null;
  assignedWorkoutPlan: string;
  assignedWorkoutPlanID: string | null;
  notes: string | null;
}
