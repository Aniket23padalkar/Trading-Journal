export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  password_hash: string;
  created_at: Date;
}

export type SafeUser = Omit<User, "password_hash">;

export interface RegisterBodyData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginBodyData {
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  message: string;
}

export interface SafeUserWithToken {
  token: string;
  user: SafeUser;
}
