import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/authService.js";
import type {
  AuthContextType,
  AuthProviderProps,
  User,
} from "../types/auth.types.js";

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getCurrentUser();

        setUser(res);
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
