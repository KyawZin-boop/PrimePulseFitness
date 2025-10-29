import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "@/configs/axios";
import type { Review, AddReview, UpdateReview } from "./type";

const BASE_URL = "/Review";

// Get reviews for a specific target (trainer or class)
export const getReviewsByTarget = {
  queryKey: (receiverID: string, type: string) => [
    "getReviewsByTarget",
    receiverID,
    type,
  ],
  queryFn: async (receiverID: string, type: string) => {
    const { data } = await axios.get<Review[]>(
      `${BASE_URL}/${type}/${receiverID}`
    );
    return data;
  },
  useQuery: (receiverID: string, type: string, opt?: Partial<UseQueryOptions<Review[], Error>>) =>
    useQuery<Review[], Error>({
      queryKey: getReviewsByTarget.queryKey(receiverID, type),
      queryFn: () => getReviewsByTarget.queryFn(receiverID, type),
      enabled: Boolean(receiverID && type),
      ...opt,
    }),
};

// Get user's reviews
export const getUserReviews = {
  queryKey: ["getUserReviews"],
  queryFn: async () => {
    const { data } = await axios.get<Review[]>(`${BASE_URL}/GetAllReviews`);
    return data;
  },
  useQuery: (opt?: Partial<UseQueryOptions<Review[], Error>>) =>
    useQuery<Review[], Error>({
      queryKey: getUserReviews.queryKey,
      queryFn: getUserReviews.queryFn,
      ...opt,
    }),
};

export const getReviewsByTrainerId = {
  useQuery: (
    trainerId: string,
    opt?: Partial<UseQueryOptions<Review[]>>
  ) =>
    useQuery<Review[], Error>({
      queryKey: ["getReviewsByTrainerId", trainerId],
      queryFn: async () => {
        const response: ApiResponse<Review[]> = await axios
          .get(`${BASE_URL}/GetReviewsByTrainerId?trainerId=${trainerId}`)
          .then((res) => res.data);

        return response.data;
      },
      enabled: Boolean(trainerId),
      ...opt,
    }),
};

// Get reviews by class ID
export const getReviewsByClassId = {
  useQuery: (
    classId: string,
    opt?: Partial<UseQueryOptions<Review[]>>
  ) =>
    useQuery<Review[], Error>({
      queryKey: ["getReviewsByClassId", classId],
      queryFn: async () => {
        const response: ApiResponse<Review[]> = await axios
          .get(`${BASE_URL}/GetReviewsByClassId?classId=${classId}`)
          .then((res) => res.data);

        return response.data;
      },
      enabled: Boolean(classId),
      ...opt,
    }),
};

// Add a review
export const addReview = {
  mutationFn: async (review: AddReview) => {
    const { data } = await axios.post<Review>(`${BASE_URL}/CreateReview`, review);
    return data;
  },
  useMutation: (opt?: Partial<UseMutationOptions<Review, Error, AddReview>>) =>
    useMutation<Review, Error, AddReview>({
      mutationFn: addReview.mutationFn,
      ...opt,
    }),
};

// Update a review
export const updateReview = {
  mutationFn: async (review: UpdateReview) => {
    const { data } = await axios.put<Review>(
      `${BASE_URL}/${review.reviewID}`,
      review
    );
    return data;
  },
  useMutation: (opt?: Partial<UseMutationOptions<Review, Error, UpdateReview>>) =>
    useMutation<Review, Error, UpdateReview>({
      mutationFn: updateReview.mutationFn,
      ...opt,
    }),
};

// Delete a review
export const deleteReview = {
  mutationFn: async (reviewID: string) => {
    const { data } = await axios.delete(`${BASE_URL}/${reviewID}`);
    return data;
  },
  useMutation: (opt?: Partial<UseMutationOptions<null, Error, string>>) =>
    useMutation<null, Error, string>({
      mutationFn: deleteReview.mutationFn,
      ...opt,
    }),
};
