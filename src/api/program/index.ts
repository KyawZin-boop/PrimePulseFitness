import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "@/configs/axios";
import { AddProgram, Program, UpdateProgram } from "./type";

const BASE_URL = "WorkoutPlan";

export const getProgramsByTrainerId = {
  useQuery: (
    trainerId: string,
    opt?: Partial<UseQueryOptions<Program[]>>
  ) =>
    useQuery<Program[], Error>({
      queryKey: ["getProgramsByTrainerId", trainerId],
      queryFn: async () => {
        const response: ApiResponse<Program[]> = await axios
          .get(`${BASE_URL}/GetWorkoutPlanByTrainerId`, {
            params: { trainerId },
          })
          .then((res) => res.data);

        return response.data;
      },
      enabled: Boolean(trainerId),
      ...opt,
    }),
};

export const createProgram = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, AddProgram>>
  ) =>
    useMutation<null, Error, AddProgram>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/CreateWorkoutPlan`, payload);
        return request.data;
      },
      ...opt,
    }),
};

export const updateProgram = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, UpdateProgram>>
  ) =>
    useMutation<null, Error, UpdateProgram>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/UpdateWorkoutPlan`, payload);
        return request.data;
      },
      ...opt,
    }),
};

export const deleteProgram = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, string>>
  ) =>
    useMutation<null, Error, string>({
      mutationFn: async (programId) => {
        const request = await axios.delete(`${BASE_URL}/DeleteWorkoutPlan`, {
          params: { programId },
        });
        return request.data;
      },
      ...opt,
    }),
};

export const assignProgram = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, { planId: string; userId: string }>>
  ) =>
    useMutation<null, Error, { planId: string; userId: string }>({
      mutationFn: async ({ planId, userId }) => {
        const request = await axios.post(`${BASE_URL}/AssignWorkoutPlanToUser?userId=${userId}&planId=${planId}`);
        return request.data;
      },
      ...opt,
    }),
};
