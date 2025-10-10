import axios from "@/configs/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  QueryOptions,
} from "@tanstack/react-query";

const BASE_URL = "Trainer";

export const getAllTrainers = {
  useQuery: (opt?: QueryOptions<Trainer[]>) =>
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
  useQuery: (opt?: QueryOptions<Trainer[]>) =>
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
