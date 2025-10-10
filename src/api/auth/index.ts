import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "Authentication";

export const googleLoginMutation = {
  useMutation: (
    opt?: UseMutationOptions<string, Error, GoogleLoginPayload, void>
  ) =>
    useMutation({
      mutationKey: ["googleLoginMutation"],
      mutationFn: async (payload: GoogleLoginPayload) => {
        const response = await axios.post(`${BASE_URL}/GoogleLogin`, payload);
        return response.data.data;
      },
      ...opt,
    }),
};

export const registerMutation = {
  useMutation: (
    opt?: UseMutationOptions<string, Error, RegisterPayload, void>
  ) =>
    useMutation({
      mutationKey: ["registerMutation"],
      mutationFn: async (payload: RegisterPayload) => {
        const response = await axios.post(`${BASE_URL}/Register`, payload);
        return response.data.data;
      },
      ...opt,
    }),
};

export const loginMutation = {
  useMutation: (
    opt?: Partial<UseMutationOptions<string, Error, UserLogin>>
  ) => {
    return useMutation<string, Error, UserLogin>({
      mutationFn: async (payload) => {
        const response: ApiResponse<string> = await axios
          .post(`${BASE_URL}/Login`, payload)
          .then((res) => res.data);
        return response.data; // Assuming Data is the JWT token string
      },
      ...opt,
    });
  },
};
