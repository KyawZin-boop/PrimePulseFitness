import axios from "@/configs/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

const BASE_URL = "Wishlist";

export interface WishlistItem {
  wishlistID: string;
  itemID: string;
  type: string;
  product?: ProductType;
  addedDate: string;
}

export interface AddToWishlistPayload {
  userID: string;
  itemID: string;
  type: string;
}

export const getUserWishlist = {
  useQuery: (userId: string, opt?: Partial<UseQueryOptions<WishlistItem[], Error>>) =>
    useQuery<WishlistItem[], Error>({
      queryKey: ["getUserWishlist", userId],
      queryFn: async () => {
        const response: ApiResponse<WishlistItem[]> = await axios
          .get(`${BASE_URL}/GetUserWishlist`, {
            params: { userId },
          })
          .then((res) => res.data);

        return response.data;
      },
      enabled: !!userId,
      ...opt,
    }),
};

export const checkWishlistItem = {
  useQuery: (userId: string, itemId: string, opt?: Partial<UseQueryOptions<boolean, Error>>) =>
    useQuery<boolean, Error>({
      queryKey: ["checkWishlistItem", userId, itemId],
      queryFn: async () => {
        const response: ApiResponse<boolean> = await axios
          .get(`${BASE_URL}/CheckWishlistItem`, {
            params: { userId, itemId },
          })
          .then((res) => res.data);

        return response.data;
      },
      enabled: !!userId && !!itemId,
      ...opt,
    }),
};

export const addToWishlist = {
  useMutation: (
    opt?: Partial<UseMutationOptions<boolean, Error, AddToWishlistPayload>>
  ) => {
    return useMutation<boolean, Error, AddToWishlistPayload>({
      mutationFn: async (payload) => {
        const response: ApiResponse<boolean> = await axios
          .post(`${BASE_URL}/AddToWishlist`, payload)
          .then((res) => res.data);
        return response.data;
      },
      ...opt,
    });
  },
};

export const removeFromWishlist = {
  useMutation: (
    opt?: Partial<
      UseMutationOptions<boolean, Error, { userId: string; itemId: string }>
    >
  ) => {
    return useMutation<boolean, Error, { userId: string; itemId: string }>({
      mutationFn: async ({ userId, itemId }) => {
        const response: ApiResponse<boolean> = await axios
          .delete(`${BASE_URL}/RemoveFromWishlist`, {
            params: { userId, itemId },
          })
          .then((res) => res.data);
        return response.data;
      },
      ...opt,
    });
  },
};
