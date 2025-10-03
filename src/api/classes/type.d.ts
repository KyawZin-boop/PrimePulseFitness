type GymClass = {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  capacity: string;
  time: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  rating: number;
  description: string;
  highlights: string[];
};