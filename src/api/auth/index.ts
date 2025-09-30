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
