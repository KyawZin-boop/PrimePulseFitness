type JwtPayload = {
  userID: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iat: number;
};

type UserCredentials = {
  userId: string;
  name: string;
  email: string;
  role: string;
};

type GoogleLoginPayload = {
  idToken: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
};

type UserLogin = {
  email: string;
  password: string;
};

type ChangePasswordPayload = {
  userID: string;
  oldPassword: string;
  newPassword: string;
};
