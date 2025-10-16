import axios from "@/configs/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  QueryOptions,
} from "@tanstack/react-query";
import { User } from "./type";

const BASE_URL = "User";

export const getAllUsers = {
  useQuery: (opt?: QueryOptions<User[]>) =>
    useQuery<User[], Error>({
      queryKey: ["getAllUsers"],
      queryFn: async () => {
        const response: ApiResponse<User[]> = await axios
          .get(`${BASE_URL}/GetAllUsers`)
          .then((res) => res.data);

        return response.data;
      },
      ...opt,
    }),
};