export type Exercise = {
    exerciseID: string;
    programID: string;
    name: string;
    sets: number;
    reps: number;
    restPeriod: number;
    instructions: string | null;
};

export type Program = {
    workoutPlanID: string;
    trainerID: string;
    name: string;
    description: string;
    duration: number;
    exercises: Exercise[];
    assignedCount: number;
};

export type AddExercise = {
    name: string;
    sets: number;
    reps: number;
    restPeriod: number;
    instructions?: string | null;
};

export type AddProgram = {
    trainerID: string;
    name: string;
    description: string;
    duration: number;
    exercises: AddExercise[];
};

export type UpdateExercise = {
    exerciseID?: string;
    name: string;
    sets: number;
    reps: number;
    restPeriod: number;
    instructions?: string | null;
};

export type UpdateProgram = {
    workoutPlanID: string;
    trainerID: string;
    name: string;
    description: string;
    duration: number;
    exercises: UpdateExercise[];
};
