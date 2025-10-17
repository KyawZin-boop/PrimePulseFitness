import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "Order";

export const createOrder = {
  useMutation: (
    opt?: Partial<UseMutationOptions<OrderType, Error, CreateOrderPayload>>
  ) => {
    return useMutation<OrderType, Error, CreateOrderPayload>({
      mutationFn: async (payload) => {
        const request = await axios.post(`${BASE_URL}/CreateOrder`, payload);
        return request.data.data; // Assuming Data is the created Order
      },
      ...opt,
    });
  },
};

export const confirmOrder = {
  useMutation: (
    opt?: Partial<UseMutationOptions<OrderType, Error, string>>
  ) => {
    return useMutation<OrderType, Error, string>({
      mutationFn: async (payload) => {
        const request = await axios.post(
          `${BASE_URL}/ConfirmOrder?orderId=${payload}`
        );
        return request.data.data; // Assuming Data is the confirmed Order
      },
      ...opt,
    });
  },
};

export const rejectOrder = {
  useMutation: (
    opt?: Partial<UseMutationOptions<OrderType, Error, string>>
  ) => {
    return useMutation<OrderType, Error, string>({
      mutationFn: async (payload) => {
        const request = await axios.post(
          `${BASE_URL}/RejectOrder?orderId=${payload}`
        );
        return request.data.data; // Assuming Data is the rejected Order
      },
      ...opt,
    });
  },
};

export const getAllOrders = {
  useQuery: (opt?: UseQueryOptions<OrderResponseType[], Error>) => {
    return useQuery<OrderResponseType[], Error>({
      queryKey: ["getAllOrders"],
      queryFn: async () => {
        const request = await axios.get(`${BASE_URL}/GetAllOrders`);
        return request.data.data;
      },
      ...opt,
    });
  },
};

export const getOrderById = {
  useQuery: (
    orderId: string,
    opt?: UseQueryOptions<OrderResponseType, Error>
  ) => {
    return useQuery<OrderResponseType, Error>({
      queryKey: ["getOrderById", orderId],
      queryFn: async () => {
        const request = await axios.get(`${BASE_URL}/GetOrderByID/${orderId}`);
        return request.data.data;
      },
      ...opt,
    });
  },
};

export const getOrdersByUserId = {
  useQuery: (
    userId: string,
    opt?: UseQueryOptions<OrderResponseType[], Error>
  ) => {
    return useQuery<OrderResponseType[], Error>({
      queryKey: ["getOrdersByUserId", userId],
      queryFn: async () => {
        const request = await axios.get(
          `${BASE_URL}/GetOrdersByUserID/${userId}`
        );
        return request.data.data;
      },
      ...opt,
    });
  },
};
