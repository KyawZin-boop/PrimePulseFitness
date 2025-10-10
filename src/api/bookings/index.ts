import axios from "axios";
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

const BASE_URL = "Booking";

export const createBooking = {
  useMutation: (
    opt?: Partial<UseMutationOptions<Booking, Error, CreateBooking>>
  ) => {
    return useMutation<Booking, Error, CreateBooking>({
      mutationFn: async (payload) => {
        const response: ApiResponse<Booking> = await axios
          .post(`${BASE_URL}/CreateBooking`, payload)
          .then((res) => res.data);
        return response.data;
      },
      ...opt,
    });
  },
};

export const getBookingsByUserId = {
  useQuery: (userId: string, opt?: UseQueryOptions<Booking[], Error>) =>
    useQuery<Booking[], Error>({
      queryKey: ["getBookingsByUserId", userId],
      queryFn: async () => {
        const response: ApiResponse<Booking[]> = await axios
          .get(`${BASE_URL}/GetBookingsByUserId?userId=${userId}`)
          .then((res) => res.data);
        return response.data;
      },
      ...opt,
    }),
};

export const getPendingBookingsByTrainerId = {
  useQuery: (trainerId: string, opt?: UseQueryOptions<Booking[], Error>) =>
    useQuery<Booking[], Error>({
      queryKey: ["getPendingBookingsByTrainerId", trainerId],
      queryFn: async () => {
        const response: ApiResponse<Booking[]> = await axios
          .get(
            `${BASE_URL}/GetPendingBookingsByTrainerId?trainerId=${trainerId}`
          )
          .then((res) => res.data);
        return response.data;
      },
      ...opt,
    }),
};
