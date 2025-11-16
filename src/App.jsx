import React, { Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import FilterContextProvider from "./context/FilterContext";
import ProtectedRoute from "./layouts/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
const Trades = React.lazy(() => import("./pages/Trades"));
const Charts = React.lazy(() => import("./pages/Charts"));
const Calender = React.lazy(() => import("./pages/Calender"));
const ContactUs = React.lazy(() => import("./pages/ContactUs"));
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { ScaleLoader } from "react-spinners";

export default function App() {
  const { user } = useContext(AuthContext);
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
                <FilterContextProvider>
                  <Trades />
                </FilterContextProvider>
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
