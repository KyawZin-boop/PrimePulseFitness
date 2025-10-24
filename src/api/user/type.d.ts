export type User = {
  userID: string;
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  role: string;
  isExternalLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
  activeFlag: boolean;
};

export type UserResponse = {
    userID: string;
    name: string;
    email: string;
    age: number | null;
    gender: string | null;
}
