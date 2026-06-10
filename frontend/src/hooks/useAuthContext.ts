import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import type { AuthContextType } from "../types/auth.types.js";

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used withing a AuthProvider");
  }

  return context;
}
