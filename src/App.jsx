import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import LandingPage from "./pages/LandingPage";
import MainLayout from "./layouts/MainLayout";
import Properties from "./pages/Properties";
import AddProperty from "./pages/AddProperty";
import PropertyDetails from "./pages/PropertyDetails";
import Calendar from "./pages/Calendar";
import Bookings from "./pages/Bookings";
import Documents from "./pages/Documents";
import ContractorWorkflow from "./pages/ContractorWorkflow";
import Logo from "./assets/Logo.png";
import AssessmentsTab from "./components/properties/AssessmentsTab";
import LogBooksTab from "./components/properties/LogBooksTab";
import DocumentsTab from "./components/properties/DocumentsTab";
import PropertyOverview from "./components/properties/PropertyOverview";

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
  <motion.div
    className="fixed inset-0 bg-white z-50 flex items-center justify-center"
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      transition={{ duration: 0.5, repeat: 1, repeatType: "reverse" }}
      className="flex flex-col items-center"
    >
      <img src={Logo} className="h-16 w-16 text-primary-500" />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="h-1 bg-primary-500 mt-4 rounded-full"
      />
    </motion.div>
  </motion.div>
);

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

// New component for admin-only routes
const AdminProtectedRoute = ({ children }) => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (currentUser?.role !== "super_admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

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
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/home"
            element={
              <ProtectedLayout>
                {/* <LandingPage /> */}
                {/* <ContractorWorkflow */}
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
            path="/properties/add"
            element={
              <ProtectedLayout>
                <AddProperty />
              </ProtectedLayout>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <ProtectedLayout>
                <PropertyDetails />
              </ProtectedLayout>
            }
          >
            <Route index element={<PropertyOverview />} />
            <Route path="assessments" element={<AssessmentsTab />} />
            <Route path="logbooks" element={<LogBooksTab />} />
            <Route path="documents" element={<DocumentsTab />} />
          </Route>
          <Route
            path="/bookings"
            element={
              <AdminProtectedRoute>
                <Bookings />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <AdminProtectedRoute>
                <Documents />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedLayout>
                <Calendar />
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
      </AnimatePresence>
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
          <Route
            path="/contractor-workflow"
            element={
              <ProtectedLayout>
                <ContractorWorkflow />
              </ProtectedLayout>
            }
          />
          <Route path="/*" element={<AuthenticatedRoutes />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}
