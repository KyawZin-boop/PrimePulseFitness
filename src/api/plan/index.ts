import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AddPlan, Plan, UpdatePlan } from "./type";
import axios from "@/configs/axios";

const BASE_URL = "Plan";

export const getPlanByTrainerId = {
  useQuery: (trainerId: string, opt?: Partial<UseQueryOptions<Plan[]>>) => 
    useQuery<Plan[], Error>({
      queryKey: ["getPlanByTrainerId", trainerId],
      queryFn: async () => {
        const response: ApiResponse<Plan[]> = await axios.get(`${BASE_URL}/GetPlanByTrainerId?trainerId=${trainerId}`).then(res => res.data);
        
        return response.data;
      },
      ...opt,
    })
};

export const getPlanByUserId = {
  useQuery: (userId: string, opt?: Partial<UseQueryOptions<Plan[]>>) => 
    useQuery<Plan[], Error>({
      queryKey: ["getPlanByUserId", userId],
      queryFn: async () => {
        const response: ApiResponse<Plan[]> = await axios.get(`${BASE_URL}/GetPlanByUserId?userId=${userId}`).then(res => res.data);

        return response.data;
      },
      ...opt,
    })
}

export const addNewPlan = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, AddPlan>>
  ) => {
    return useMutation<null, Error, AddPlan>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/CreatePlan`, payload);
        return request.data;
      },
      ...opt,
    });
  },
};

export const updatePlan = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, UpdatePlan>>
  ) => {
    return useMutation<null, Error, UpdatePlan>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/UpdatePlan`, payload);
        return request.data;
      },
      ...opt,
    });
  },
};

export const deletePlan = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, string>>
  ) => {
    return useMutation<null, Error, string>({
      mutationFn: async (planId) => {
        const request = await axios.delete(`${BASE_URL}/DeletePlan`, {
          params: { planId },
        });
        return request.data;
      },
      ...opt,
    });
  },
};

export const assignPlan = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, { planId: string; userId: string }>>
  ) => {
    return useMutation<null, Error, { planId: string; userId: string }>({
      mutationFn: async ({ planId, userId }) => {
        const request = await axios.post(`${BASE_URL}/AssignPlanToUser?userId=${userId}&planId=${planId}`);
        
        return request.data;
      },
      ...opt,
    });
  },
};