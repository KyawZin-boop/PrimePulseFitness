export type Review = {
  reviewID?: string; // Optional as API might not return it
  userID: string;
  userName: string;
  imageUrl: string | null;
  receiverID: string;
  receiverName?: string;
  type: string; // "trainer" | "class"
  rating: number;
  content: string;
  createdAt?: Date | string; // Optional, can be Date or string
  updatedAt?: Date | string; // Optional, can be Date or string
};

export type AddReview = {
  userID: string;
  receiverID: string; // trainerID or classID
  rating: number;
  content: string;
  type: string; // "trainer" | "class"
};

export type UpdateReview = {
  reviewID: string;
  userID: string;
  rating: number;
  content: string;
};
