import React, { Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./layouts/ProtectedRoute.js";
import Dashboard from "./pages/Dashboard.jsx";
const Trades = React.lazy(() => import("./pages/Trades.js"));
const Charts = React.lazy(() => import("./pages/Charts.jsx"));
const Calender = React.lazy(() => import("./pages/Calender.jsx"));
const ContactUs = React.lazy(() => import("./pages/ContactUs.jsx"));
import MainLayout from "./layouts/MainLayout.js";
import AuthLayout from "./layouts/AuthLayout.js";
import SignUp from "./pages/SignUp.js";
import SignIn from "./pages/SignIn.js";
import { ScaleLoader } from "react-spinners";
import { useAuthContext } from "./hooks/useAuthContext.js";

export default function App() {
  const { user } = useAuthContext();
  return (
    <Suspense
      fallback={
        <div className="flex absolute h-full w-full justify-between items-center">
          <ScaleLoader color="##20dfbc" />
        </div>
      }
    >
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
    </Suspense>
  );
}
