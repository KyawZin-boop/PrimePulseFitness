type GymClass = {
  classID: string;
  trainerID: string;
  className: string;
  trainerName: string;
  duration: string;
  capacity: number;
  assignedCount: number;
  price: number;
  time: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  rating: number;
  description: string;
  highlights: string[];
};

type AddGymClass = {
  className: string;
  trainerID: string;
  duration: string;
  capacity: string;
  time: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  rating: number;
  description: string;
  highlights: string[];
};