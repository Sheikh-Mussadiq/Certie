"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Chrome,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Logo from "../../assets/Logo.png";
import { handleAuthUser } from "../../services/userServices";
import LoadingSpinner from "../LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

export default function AuthForm({ onAuthenticated, initialMode = "login" }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setCurrentUser } = useAuth();
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  // Update isLogin state when initialMode changes
  useEffect(() => {
    setIsLogin(initialMode === "login");
    setError(null);
    setSuccess(null);
  }, [initialMode]);

  // Password strength checker
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (formData.password.length >= 8) strength += 1;
    // Contains number
    if (/\d/.test(formData.password)) strength += 1;
    // Contains special char
    if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      // Handle user profile after OAuth
      if (data?.session) {
        await handleAuthUser(data.session);
        onAuthenticated();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        const UserData = await handleAuthUser(data.session);
        setCurrentUser(UserData);
        onAuthenticated();
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        // Password strength validation
        if (passwordStrength < 3 && formData.password.length > 0) {
          throw new Error("Please use a stronger password");
        }

        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          formData.fullName
        )}&background=random`;
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              avatar_url: defaultAvatar,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          const UserData = await handleAuthUser(data.session);
          setCurrentUser(UserData);
          onAuthenticated();
        } else {
          // Email confirmation required
          setSuccess("Please check your email to confirm your account");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (!formData.password) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="w-full max-w-md p-8">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-block mb-4"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {/* <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-primary-orange rounded-full flex items-center justify-center mx-auto"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div> */}
          <img src={Logo} alt="Logo" className="w-16 h-16 mx-auto mb-2" />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-primary-black mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLogin ? "Welcome Back to" : "Create Account"}{" "}
          <span className="text-primary-orange">Certie</span>
        </motion.h2>
        <motion.p
          className="text-primary-grey text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isLogin
            ? "Login with your email and passowrd you have been created before, or you can create account if you don't have a certie account"
            : "Join us and start giving your plants the care they deserve"}
        </motion.p>
      </motion.div>

      {/* Google Sign In Button */}
      <motion.button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full mb-6 flex items-center justify-center py-3 px-4 rounded-lg
          bg-white border border-grey-outline hover:border-primary-orange hover:bg-gray-50
          transition duration-150 ease-in-out relative overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-grey-fill to-transparent opacity-0 group-hover:opacity-100"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 1 }}
        />
        <Chrome className="w-5 h-5 mr-3 text-primary-black" />
        <p className="text-primary-black font-bold">Continue with Google</p>
      </motion.button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with email
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="mt-1 relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-orange h-5 w-5 transition-colors group-hover:text-primary-black" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 block w-full rounded-lg border border-primary-200 py-3 px-4 shadow-sm 
                  focus:border-primary-orange focus:ring-primary-orange bg-white bg-opacity-80 backdrop-blur-sm 
                  transition-all duration-200 group-hover:border-primary-orange"
                  required
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-primary-orange"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="mt-1 relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-orange h-5 w-5 transition-colors group-hover:text-primary-black" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-primary-200 py-3 px-4 shadow-sm 
                focus:border-primary-orange focus:ring-primary-orange bg-white bg-opacity-80 backdrop-blur-sm 
                transition-all duration-200 group-hover:border-primary-orange"
                required
              />
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 bg-primary-orange"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="mt-1 relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-orange h-5 w-5 transition-colors group-hover:text-primary-black" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 block w-full rounded-lg border border-primary-200 py-3 px-4 shadow-sm 
                focus:border-primary-orange focus:ring-primary-orange bg-white bg-opacity-80 backdrop-blur-sm 
                transition-all duration-200 group-hover:border-primary-orange"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-orange transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 bg-primary-orange"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Password strength indicator (only for signup) */}
            {!isLogin && formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-gray-500">Password strength</div>
                  <div
                    className={`text-xs ${
                      passwordStrength >= 3
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {getPasswordStrengthText()}
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getPasswordStrengthColor()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {passwordStrength < 3 && formData.password.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </div>
                )}
              </div>
            )}
          </div>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="mt-1 relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 h-5 w-5 transition-colors group-hover:text-primary-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 block w-full rounded-lg border border-primary-200 py-3 px-4 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500 bg-white bg-opacity-80 backdrop-blur-sm 
                  transition-all duration-200 group-hover:border-primary-300"
                  required
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-primary-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
            </motion.div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start p-3 rounded-lg bg-red-50 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start p-3 rounded-lg bg-green-50 text-green-600 text-sm"
              >
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={
              loading ||
              (!isLogin && formData.password !== formData.confirmPassword)
            }
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white
              bg-primary-black hover:bg-primary-black/90
              focus:ring-4 focus:ring-primary-orange/30 transition duration-150 ease-in-out
              ${
                loading ||
                (!isLogin && formData.password !== formData.confirmPassword)
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span>{isLogin ? "Login now" : "Create Account"}</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </motion.button>

          <div className="pt-2">
            <p className="text-center text-sm text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                to={isLogin ? "/signup" : "/login"}
                className="text-primary-orange hover:text-primary-black font-medium transition-colors duration-200"
              >
                {isLogin ? "Create account" : "Login"}
              </Link>
            </p>
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
