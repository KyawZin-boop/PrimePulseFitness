import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AddProgress, Progress } from "./type";
import axios from "@/configs/axios";

const BASE_URL = "Progress";

export const getUserProgressByTrainerId = {
  useQuery: (
    trainerId: string,
    opt?: Partial<UseQueryOptions<Progress[]>>
  ) =>
    useQuery<Progress[], Error>({
      queryKey: ["getUserProgressByTrainerId", trainerId],
      queryFn: async () => {
        const response: ApiResponse<Progress[]> = await axios
          .get(`${BASE_URL}/GetUserProgressByTrainerId/${trainerId}`)
          .then((res) => res.data);

        return response.data;
      },
      enabled: Boolean(trainerId),
      ...opt,
    }),
};

export const getProgressByUserId = {
  useQuery: (
    userId: string,
    opt?: Partial<UseQueryOptions<Progress[]>>
  ) =>
    useQuery<Progress[], Error>({
      queryKey: ["getProgressByUserId", userId],
      queryFn: async () => {
        const response: ApiResponse<Progress[]> = await axios
          .get(`${BASE_URL}/GetProgressByUserId/${userId}`)
          .then((res) => res.data);

        return response.data;
      },
      enabled: Boolean(userId),
      ...opt,
    }),
};

export const addProgress = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, AddProgress>>
  ) =>
    useMutation<null, Error, AddProgress>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/addProgress`, payload);
        return request.data;
      },
      ...opt,
    }),
};