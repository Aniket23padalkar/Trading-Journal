import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ScaleLoader } from "react-spinners";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading)
    return (
      <div className="flex absolute items-center justify-center h-full w-full">
        <ScaleLoader color="#20dfbc" />
      </div>
    );
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}
