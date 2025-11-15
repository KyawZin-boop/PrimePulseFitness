export type MembershipPlan = {
  membershipID: string;
  name: string;
  price: number;
  discountPercentage: number; // Percentage off at checkout
  benefits: string[];
  duration: number; // Duration in days
  activeFlag: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserMembership = {
  userMembershipID: string;
  userID: string;
  userName?: string;
  membershipID: string;
  membershipName?: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  activeFlag: boolean;
  status: "pending" | "approved" | "rejected";
  receiptImageUrl?: string;
  createdAt: string;
};

export type PurchaseMembershipPayload = {
  userID: string;
  membershipID: string;
  receiptImageUrl: string;
};

export type CreateMembershipPayload = {
  name: string;
  price: number;
  discountPercentage: number;
  benefits: string[];
  duration: number;
};

export type UpdateMembershipPayload = {
  membershipID: string;
  name: string;
  price: number;
  discountPercentage: number;
  benefits: string[];
  duration: number;
};

export type MembershipResponse = {
  membershipID: string;
  name: string;
  price: number;
  discountPercentage: number;
  benefits: string[];
  duration: number;
  activeFlag: boolean;
};

export type UserMembershipResponse = {
  userMembershipID: string;
  userID: string;
  membershipID: string;
  membershipName: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  activeFlag: boolean;
  status: "pending" | "approved" | "rejected";
  receiptImageUrl?: string;
};

export type changeStatus = {
  userMembershipId: string;
  status: "pending" | "approved" | "rejected";
}
