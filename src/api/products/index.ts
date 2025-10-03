import axios from "@/configs/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  QueryOptions,
} from "@tanstack/react-query";

const BASE_URL = "Product";

export const getAllProducts = {
  useQuery: (opt?: QueryOptions<ProductType[]>) => 
    useQuery<ProductType[], Error>({
      queryKey: ["getAllProducts"],
      queryFn: async () => {
        const response: ApiResponse<ProductType[]> = await axios.get(`${BASE_URL}/GetAllProducts`).then(res => res.data);
        
        return response.data;
      },
      ...opt,
    })
};

export const addNewProduct = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, AddProductPayload>>
  ) => {
    return useMutation<null, Error, AddProductPayload>({
      mutationFn: async (product) => {
        const request = await axios.post(`${BASE_URL}/CreateProduct`, product);
        return request.data;
      },
      ...opt,
    });
  },
};

export const updateProduct = {
  useMutation: (
    opt?: Partial<UseMutationOptions<null, Error, UpdateProductPayload>>
  ) => {
    return useMutation<null, Error, UpdateProductPayload>({
      mutationFn: async (product) => {
        const request = await axios.post(`${BASE_URL}/UpdateProduct`, product);
        return request.data;
      },
      ...opt,
    });
  },
};

export const deleteProduct = {
  useMutation: (opt?: Partial<UseMutationOptions<null, Error, string>>) => {
    return useMutation<null, Error, string>({
      mutationFn: async (productId) => {
        const request = await axios.post(
          `${BASE_URL}/DeleteProduct`,
          productId
        );
        return request.data;
      },
      ...opt,
    });
  },
};
