import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Trades from "./pages/Trades";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import Calender from "./pages/Calender";
import ContactUs from "./pages/ContactUs";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./layouts/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user, loading } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <SignUp />
          </AuthLayout>
        }
      />

      <Route
        path="/signin"
        element={
          <AuthLayout>
            <SignIn />
          </AuthLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trades"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Trades />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/charts"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Charts />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/calender"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Calender />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact-us"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ContactUs />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
