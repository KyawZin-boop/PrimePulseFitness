type GymClass = {
  classID: string;
  trainerID: string;
  className: string;
  trainerName: string;
  duration: string;
  capacity: number;
  videoUrl?: string;
  assignedCount: number;
  price: number;
  time: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  rating: number;
  description: string;
  highlights: string[];
};

type AddGymClass = {
  trainerID: string;
  className: string;
  duration: number;
  price: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  description: string;
  highlights: string[];
  time: string;
  capacity: number;
  rating: number;
};

type UpdateClassDTO = {
  classID: string;
  trainerID: string;
  className: string;
  duration: number;
  price: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  description: string;
  highlights: string[];
  time: string;
  capacity: number;
  assignedCount: number;
  rating: number;
  videoUrl?: string;
};
