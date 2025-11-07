import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/configs/axios";
import type {
  MembershipPlan,
  UserMembership,
  PurchaseMembershipPayload,
  UserMembershipResponse,
  CreateMembershipPayload,
  UpdateMembershipPayload,
  changeStatus,
} from "./type.d";

// Get all active membership plans
export const getAllMemberships = {
  queryKey: ["getAllMemberships"],
  queryFn: async (): Promise<MembershipPlan[]> => {
    const response = await axios.get("/Membership/GetAllMemberships").then((res) => res.data);
    return response.data;
  },
  useQuery: () =>
    useQuery<MembershipPlan[]>({
      queryKey: getAllMemberships.queryKey,
      queryFn: getAllMemberships.queryFn,
    }),
};

// Get user's active membership
export const getUserMembership = {
  queryKey: (userId: string) => ["getUserMembership", userId],
  queryFn: async (userId: string): Promise<UserMembership | null> => {
    if (!userId) return null;
    const response = await axios.get(`/Membership/GetUserMembershipByUserId`, {
      params: { userId },
    }).then((res) => res.data);
    return response.data;
  },
  useQuery: (userId: string) =>
    useQuery<UserMembership | null>({
      queryKey: getUserMembership.queryKey(userId),
      queryFn: () => getUserMembership.queryFn(userId),
      enabled: !!userId,
    }),
};

// Purchase a membership plan
export const purchaseMembership = {
  mutationFn: async (
    payload: PurchaseMembershipPayload
  ): Promise<UserMembershipResponse> => {
    const response = await axios.post("/Membership/PurchaseUserMembership", payload);
    return response.data;
  },
  useMutation: () =>
    useMutation({
      mutationFn: purchaseMembership.mutationFn,
    }),
};

// Create a new membership plan (Admin)
export const createMembership = {
  mutationFn: async (
    payload: CreateMembershipPayload
  ): Promise<MembershipPlan> => {
    const response = await axios.post("/Membership/CreateMembership", payload);
    return response.data;
  },
  useMutation: () =>
    useMutation({
      mutationFn: createMembership.mutationFn,
    }),
};

// Update an existing membership plan (Admin)
export const updateMembership = {
  mutationFn: async (
    payload: UpdateMembershipPayload
  ): Promise<MembershipPlan> => {
    const response = await axios.put("/Membership/Update", payload);
    return response.data;
  },
  useMutation: () =>
    useMutation({
      mutationFn: updateMembership.mutationFn,
    }),
};

// Delete a membership plan (Admin)
export const deleteMembership = {
  mutationFn: async (membershipID: string): Promise<void> => {
    await axios.delete("/Membership/Delete", {
      params: { membershipID },
    });
  },
  useMutation: () =>
    useMutation({
      mutationFn: deleteMembership.mutationFn,
    }),
};

// Get all user memberships (Admin) - includes all statuses
export const getAllUserMemberships = {
  queryKey: ["getAllUserMemberships"],
  queryFn: async (): Promise<UserMembership[]> => {
    const response = await axios.get("/Membership/GetAllUserMembership").then((res) => res.data);
    return response.data;
  },
  useQuery: () =>
    useQuery<UserMembership[]>({
      queryKey: getAllUserMemberships.queryKey,
      queryFn: getAllUserMemberships.queryFn,
    }),
};

// Change membership status (Admin)
export const changeMembershipStatus = {
  mutationFn: async (payload: changeStatus): Promise<void> => {
    await axios.post("/Membership/ChangeStatus", payload);
  },
  useMutation: () =>
    useMutation({
      mutationFn: changeMembershipStatus.mutationFn,
    }),
};
