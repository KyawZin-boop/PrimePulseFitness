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
};
