import { Navigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { useAuthContext } from "../hooks/useAuthContext.js";
import type { ContextProviderProps } from "../types/context.types.js";

export default function ProtectedRoute({ children }: ContextProviderProps) {
  const { user, authLoading } = useAuthContext();

  if (authLoading)
    return (
      <div className="flex absolute items-center justify-center h-full w-full">
        <ScaleLoader color="#20dfbc" />
      </div>
    );
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}
