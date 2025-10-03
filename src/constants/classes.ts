export type GymClass = {
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

export const gymClasses: GymClass[] = [
  {
    id: "strength-forge",
    name: "Strength Forge",
    instructor: "Jordan Blake",
    duration: "60 min",
    capacity: "18 athletes",
    time: "Mon, Wed, Fri • 6:30 AM",
    difficulty: "Advanced",
    rating: 4.9,
    description:
      "Powerlifting-inspired session focused on heavy compound lifts, tempo control, and confident progressions.",
    highlights: [
      "Periodized programming with progressive overload",
      "Technique coaching on squat, bench, and deadlift variations",
      "Finisher circuits for grip, core, and accessory strength",
    ],
  },
  {
    id: "kid-fit-explorers",
    name: "Kid Fit Explorers",
    instructor: "Leah Martinez",
    duration: "45 min",
    capacity: "20 kids",
    time: "Sat • 10:00 AM",
    difficulty: "Beginner",
    rating: 4.8,
    description:
      "High-energy obstacle courses, teamwork drills, and playful cardio to keep kids moving and smiling.",
    highlights: [
      "Certified youth fitness coach with CPR training",
      "Focus on coordination, balance, and confidence",
      "Weekly themed challenges and parent showcase days",
    ],
  },
  {
    id: "cardio-surge",
    name: "Cardio Surge",
    instructor: "Amelia Brooks",
    duration: "50 min",
    capacity: "22 athletes",
    time: "Tue & Thu • 6:00 PM",
    difficulty: "Intermediate",
    rating: 4.9,
    description:
      "Beat-driven intervals, sled pushes, and endurance circuits designed to sharpen stamina and agility.",
    highlights: [
      "Heart-rate guided intensity blocks",
      "Hybrid treadmill, rower, and sled intervals",
      "Performance tracking with weekly benchmark tests",
    ],
  },
  {
    id: "mind-body-reset",
    name: "Mind & Body Reset",
    instructor: "Nina Patel",
    duration: "70 min",
    capacity: "16 guests",
    time: "Sun • 8:30 AM",
    difficulty: "All Levels",
    rating: 4.8,
    description:
      "Guided breathwork, restorative flows, and mobility work to reset your nervous system and mindset.",
    highlights: [
      "Guided meditation and nervous system downshifting",
      "Myofascial release tools provided on site",
      "Take-home mobility sequences for daily practice",
    ],
  },
];

export const getGymClassById = (id: string) =>
  gymClasses.find((gymClass) => gymClass.id === id);
