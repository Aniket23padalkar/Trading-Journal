import { Navigate } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { ScaleLoader } from "react-spinners";
import { useAuthContext } from "../hooks/useAuthContext.js";

export default function ProtectedRoute({ children }: React.ReactNode) {
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
