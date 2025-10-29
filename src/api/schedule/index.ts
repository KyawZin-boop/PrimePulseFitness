import axios from "@/configs/axios";
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";

export type TrainerSchedule = {
  scheduleID: string;
  trainerID: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes?: string;
};

export type CreateTrainerSchedule = Omit<TrainerSchedule, "scheduleID">;
export type UpdateTrainerSchedule = TrainerSchedule;

const BASE_URL = "Schedule";

export const getSchedulesByTrainerId = {
  useQuery: (trainerId: string, opt?: Partial<UseQueryOptions<TrainerSchedule[], Error>>) =>
    useQuery<TrainerSchedule[], Error>({
      queryKey: ["getSchedulesByTrainerId", trainerId],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetSchedulesByTrainerId`, { params: { trainerId } });
        return response.data.data;
      },
      ...opt,
    }),
};

export const getAvailableSchedulesByTrainerId = {
  useQuery: (trainerId: string, opt?: Partial<UseQueryOptions<TrainerSchedule[], Error>>) =>
    useQuery<TrainerSchedule[], Error>({
      queryKey: ["getAvailableSchedulesByTrainerId", trainerId],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/GetAvailableSchedulesByTrainerId`, { params: { trainerId } });
        return response.data.data;
      },
      ...opt,
    }),
};

export const createSchedule = {
  useMutation: (opt?: Partial<UseMutationOptions<TrainerSchedule, Error, CreateTrainerSchedule>>) =>
    useMutation<TrainerSchedule, Error, CreateTrainerSchedule>({
      mutationFn: async (payload) => {
        const response = await axios.post(`${BASE_URL}/CreateSchedule`, payload);
        return response.data.data;
      },
      ...opt,
    }),
};

export const updateSchedule = {
  useMutation: (opt?: Partial<UseMutationOptions<TrainerSchedule, Error, UpdateTrainerSchedule>>) =>
    useMutation<TrainerSchedule, Error, UpdateTrainerSchedule>({
      mutationFn: async (payload) => {
        const response = await axios.post(`${BASE_URL}/UpdateSchedule`, payload);
        return response.data.data;
      },
      ...opt,
    }),
};

export const deleteSchedule = {
  useMutation: (opt?: Partial<UseMutationOptions<void, Error, string>>) =>
    useMutation<void, Error, string>({
      mutationFn: async (scheduleID) => {
        await axios.delete(`${BASE_URL}/DeleteSchedule/${scheduleID}`);
      },
      ...opt,
    }),
};
