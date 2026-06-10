export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
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

export interface RegisterUserResponse {
  success: boolean;
  message: string;
}
