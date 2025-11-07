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
  useMutation: (opt?: UseMutationOptions<string, Error, UserLogin, void>) =>
    useMutation({
      mutationKey: ["loginMutation"],
      mutationFn: async (payload: UserLogin) => {
        const response = await axios.post(`${BASE_URL}/Login`, payload);
        return response.data;
      },
      ...opt,
    }),
};

export const changePasswordMutation = {
  useMutation: (
    opt?: UseMutationOptions<void, Error, ChangePasswordPayload, void>
  ) =>
    useMutation({
      mutationKey: ["changePasswordMutation"],
      mutationFn: async (payload: ChangePasswordPayload) => {
        const response = await axios.post(`${BASE_URL}/ChangePassword`, payload);
        return response.data;
      },
      ...opt,
    }),
};
