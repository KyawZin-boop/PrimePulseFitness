type GymClass = {
  classID: string;
  className: string;
  trainerID: string;
  trainerName: string;
  duration: string;
  capacity: string;
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