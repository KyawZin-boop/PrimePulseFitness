import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "Category";

export const getAllCategories = {
  useQuery: (opt?: UseQueryOptions<Category[], Error>) =>
    useQuery<Category[], Error>({
      queryKey: ["getAllCategories"],
      queryFn: async () => {
        const response: ApiResponse<Category[]> = await axios
          .get(`${BASE_URL}/GetAllCategories`)
          .then((res) => res.data);

        return response.data;
      },
      ...opt,
    }),
};

export const createCategory = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, CreateCategory>>
  ) => {
    return useMutation<null, Error, CreateCategory>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/CreateCategory`, payload);
        return request.data;
      },
      ...opt,
    });
  },
};

export const updateCategory = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, UpdateCategory>>
  ) => {
    return useMutation<null, Error, UpdateCategory>({
      mutationFn: async (payload) => {
        const request = await axios.put(`${BASE_URL}/UpdateCategory`, payload);
        return request.data;
      },
      ...opt,
    });
  },
};

export const deleteCategory = {
  useMutation: (opt?: Partial<UseMutationOptions<null, Error, string>>) => {
    return useMutation<null, Error, string>({
      mutationFn: async (categoryID) => {
        const request = await axios.delete(
          `${BASE_URL}/DeleteCategory/${categoryID}`
        );
        return request.data;
      },
      ...opt,
    });
  },
};
