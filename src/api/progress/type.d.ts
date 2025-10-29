export type Progress = {
    progressID: string;
    userID: string;
    imageUrl: string | null;
    goalWeight: number;
    currentWeight: number;
    bodyFat: number;
    chest: number | null;
    waist: number | null;
    arms: number | null;
    thighs: number | null;
    hips: number | null;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export type AddProgress = {
    userID: string;
    imageUrl: string | null;
    goalWeight: number;
    currentWeight: number;
    bodyFat: number;
    chest: number | null;
    waist: number | null;
    arms: number | null;
    thighs: number | null;
    hips: number | null;
    notes: string;
}