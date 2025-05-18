import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import LandingPage from "./pages/LandingPage";
import MainLayout from "./layouts/MainLayout";
import Properties from "./pages/Properties";
import ContractorWorkflow from "./pages/ContractorWorkflow";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
  </div>
);

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const ProtectedLoginRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <LoginSignUpPage />;
};

const AuthenticatedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <ProtectedLayout>
              <Properties />
            </ProtectedLayout>
          }
        />
        <Route
          path="/properties"
          element={
            <ProtectedLayout>
              <Properties />
            </ProtectedLayout>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedLayout>
              <Navigate to="/home" replace />
            </ProtectedLayout>
          }
        />
      </Routes>
    </MainLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<ProtectedLoginRoute />} />
          <Route path="/*" element={<AuthenticatedRoutes />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}