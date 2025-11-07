import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { AddTutorialDTO } from "./type";

const BASE_URL = "Tutorial";

export const AddTutorial = {
  useMutation: (opt?: Partial<UseMutationOptions<null, Error, AddTutorialDTO>>) => {
    return useMutation<null, Error, AddTutorialDTO>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/UploadTutorial`, payload);
        return request.data;
      },
      ...opt,
    });
  },
};

export const DeleteTutorial = {
  useMutation: (opt?: Partial<UseMutationOptions<null, Error, { classId: string; trainerId: string }>>) => {
    return useMutation<null, Error, { classId: string; trainerId: string }>({
      mutationFn: async ({ classId, trainerId }) => {
        const request = await axios.delete(`${BASE_URL}/DeleteTutorial?classId=${classId}&trainerId=${trainerId}`);
        return request.data;
      },
      ...opt,
    });
  },
};