import type { User } from "./auth.types.js";

export interface ContextProviderProps {
  children: React.ReactNode;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  authLoading: boolean;
}

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}
