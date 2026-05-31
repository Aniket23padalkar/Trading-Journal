export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  password_hash: string;
  created_at: Date;
}

export type SafeUser = Omit<User, "password_hash">;

export interface BodyUserData {
  [key: string]: string;
}

export interface RegisterUserResponse {
  message: string;
}

export interface SafeUserWithToken {
  token: string;
  user: SafeUser;
}
