export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: Date;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  authLoading: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface UserSignUpData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export type RegisterUserParams = Omit<UserSignUpData, "confirm_password">;

export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string };

export interface RegisterUserResponse {
  success: boolean;
  message: string;
}

export interface UserSignInData {
  email: string;
  password: string;
}

export interface SignInUserResponse {
  success: boolean;
  data: User;
}
