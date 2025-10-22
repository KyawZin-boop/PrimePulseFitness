import axios from "@/configs/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

const BASE_URL = "Trainer";

export const getAllTrainers = {
  useQuery: (opt?: Partial<UseQueryOptions<Trainer[], Error>>) =>
    useQuery<Trainer[], Error>({
      queryKey: ["getAllTrainers"],
      queryFn: async () => {
        const response: ApiResponse<Trainer[]> = await axios
          .get(`${BASE_URL}/GetAllTrainers`)
          .then((res) => res.data);

        return response.data;
      },
      ...opt,
    }),
};

export const getPopularTrainers = {
  useQuery: (opt?: Partial<UseQueryOptions<Trainer[], Error>>) =>
    useQuery<Trainer[], Error>({
      queryKey: ["getPopularTrainers"],
      queryFn: async () => {
        const response: ApiResponse<Trainer[]> = await axios
          .get(`${BASE_URL}/GetPopularTrainers`)
          .then((res) => res.data);

        return response.data;
      },
      ...opt,
    }),
};

export const addNewTrainer = {
  useMutation: (opt?: Partial<UseMutationOptions<null, Error, AddTrainer>>) => {
    return useMutation<null, Error, AddTrainer>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/CreateTrainer`, payload);
        return request.data;
      },
      ...opt,
    });
  },
};

export const getTrainerData = {
  useQuery: (userId: string, opt?: Partial<UseQueryOptions<Trainer, Error>>) =>
    useQuery<Trainer, Error>({
      queryKey: ["getTrainerData", userId],
      queryFn: async () => {
        const response: ApiResponse<Trainer> = await axios
          .get(`${BASE_URL}/GetTrainerByUserId`, { params: { userId } })
          .then((res) => res.data);

        return response.data;
      },
      ...opt,
    }),
};

export const updateBookingStatus = {
  useMutation: (
    opt?: Partial<
      UseMutationOptions<
        TrainerPendingBooking,
        Error,
        { bookingId: string; status: string }
      >
    >
  ) =>
    useMutation<
      TrainerPendingBooking,
      Error,
      { bookingId: string; status: string }
    >({
      mutationFn: async ({ bookingId, status }) => {
        const response: ApiResponse<TrainerPendingBooking> = await axios
          .post(`${BASE_URL}/UpdateBookingStatus`, null, {
            params: { bookingId, status },
          })
          .then((res) => res.data);
        return response.data;
      },
      ...opt,
    }),
};
