import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center h-dvh w-full">
      {children}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
