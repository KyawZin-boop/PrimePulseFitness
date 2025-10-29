import axios from "@/configs/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  QueryOptions,
} from "@tanstack/react-query";
import { UpdateUser, User } from "./type";

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

export const getUserById = {
  useQuery: (userId: string, opt?: QueryOptions<User>) =>
    useQuery<User, Error>({
      queryKey: ["getUserById", userId],
      queryFn: async () => {
        const response: ApiResponse<User> = await axios
          .get(`${BASE_URL}/GetUserById/${userId}`)
          .then((res) => res.data);
        return response.data;
      },
      ...opt,
    }),
};

// Suspend a user
export const suspendUser = {
  useMutation: (opt?: Partial<UseMutationOptions<null, Error, string>>) => {
    return useMutation<null, Error, string>({
      mutationFn: async (userId) => {
        const request = await axios.post(`${BASE_URL}/SuspendUser/${userId}`);
        return request.data;
      },
      ...opt,
    });
  },
};

// Activate a user
export const activateUser = {
  useMutation: (opt?: Partial<UseMutationOptions<null, Error, string>>) => {
    return useMutation<null, Error, string>({
      mutationFn: async (userId) => {
        const request = await axios.post(`${BASE_URL}/ActivateUser/${userId}`);
        return request.data;
      },
      ...opt,
    });
  },
};

export const updateUser = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, UpdateUser>>
  ) => {
    return useMutation<null, Error, UpdateUser>({
      mutationFn: async (payload) => {
        const response = await axios.post(`${BASE_URL}/UpdateUser`, payload);

        return response.data;
      },
      ...opt,
    });
  },
};
