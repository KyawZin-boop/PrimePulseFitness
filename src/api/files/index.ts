import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const BASE_URL = "/File";

export const uploadFile = {
  useMutation: (
    opt?: UseMutationOptions<string, AxiosError<UploadError>, File, void>
  ) =>
    useMutation({
      mutationKey: ["uploadFile"],
      mutationFn: async (file: File): Promise<string> => {
        if (!file || file.size === 0) {
          throw new Error("File is empty or invalid");
        }

        const formData = new FormData();
        // Directly append the File object - no need to wrap in Blob
        formData.append("file", file);

        const response = await axios.post<UploadResponse>(
          `${BASE_URL}/UploadFile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Check if request was successful
        if (response.status !== 200) {
          throw new AxiosError(
            `Upload failed with status ${response.status}`,
            "UPLOAD_FAILED",
            undefined,
            undefined,
            response
          );
        }

        // Backend returns the entire ResponseModel, so data.fileUrl is at response.data.data
        if (!response.data?.data) {
          throw new Error("Invalid response: No file URL received");
        }

        return response.data.data;
      },
      // Don't need throwOnError: true - axios already throws on HTTP errors
      ...opt,
    }),
};