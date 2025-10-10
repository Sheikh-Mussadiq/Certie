import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  X,
  User,
  Mail,
  Lock,
  Chrome,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { handleAuthUser } from "../../services/userServices";
import LoadingSpinner from "../LoadingSpinner";
import Logo from "../../assets/Logo.png";
import EmailConfirmation from "../auth/EmailConfirmation";

const AuthModal = ({ isOpen, onClose, onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  const { isAuthenticated, setCurrentUser } = useAuth();

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

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
      if (data?.session) {
        const userData = await handleAuthUser(data.session);
        setCurrentUser(userData);
        onAuthenticated();
        onClose();
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
          email,
          password,
        });
        if (error) throw error;
        const userData = await handleAuthUser(data.session);
        setCurrentUser(userData);
        onAuthenticated();
        onClose();
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (passwordStrength < 3 && password.length > 0) {
          throw new Error("Please use a stronger password");
        }

        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          fullName
        )}&background=random`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              avatar_url: defaultAvatar,
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        
        // Store user data for email confirmation
        setPendingUserData({
          email: email,
          fullName: fullName,
          avatar: defaultAvatar,
        });
        
        // Show email confirmation screen
        setShowEmailConfirmation(true);
        setSuccess("Confirmation email sent successfully");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingUserData.email,
      });
      
      if (error) throw error;
      setSuccess("Confirmation email sent successfully");
    } catch (error) {
      setError(error.message || "Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setShowEmailConfirmation(false);
    setPendingUserData(null);
    setError(null);
    setSuccess(null);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (!password) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  if (isAuthenticated || !isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {!showEmailConfirmation && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Show Email Confirmation or Regular Auth Form */}
            {showEmailConfirmation && pendingUserData ? (
              <>
                <div className="flex flex-col items-center mb-6">
                  <img src={Logo} alt="Certie Logo" className="w-16 h-16 mb-4" />
                </div>
                <EmailConfirmation
                  email={pendingUserData.email}
                  onResend={handleResendEmail}
                  onBack={handleBackToSignup}
                  loading={loading}
                  success={success}
                />
              </>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <img src={Logo} alt="Certie Logo" className="w-16 h-16 mb-4" />
                  <h2 className="text-2xl font-bold text-primary-black mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-sm text-center text-primary-grey">
                    {isLogin
                      ? "Sign in to complete your booking"
                      : "Create an account to complete your booking"}
                  </p>
                </div>

            {/* Google Sign In */}
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mb-4 flex items-center justify-center py-3 px-4 rounded-lg bg-white border border-grey-outline hover:border-primary-orange hover:bg-gray-50 transition duration-150 ease-in-out"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Chrome className="w-5 h-5 mr-3 text-primary-black" />
              <span className="text-primary-black font-medium">
                Continue with Google
              </span>
            </motion.button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-grey h-5 w-5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10 w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-grey h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-grey h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-orange transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {!isLogin && password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs text-gray-500">
                        Password strength
                      </div>
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
                    {passwordStrength < 3 && password.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Use 8+ characters with a mix of letters, numbers &
                        symbols
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-grey h-5 w-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                      required
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
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
                disabled={loading || (!isLogin && password !== confirmPassword)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white bg-primary-black hover:bg-primary-black/90 transition duration-150 ease-in-out ${
                  loading || (!isLogin && password !== confirmPassword)
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
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </motion.button>

              <div className="pt-2">
                <p className="text-center text-sm text-gray-600">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-primary-orange hover:text-primary-black font-medium transition-colors"
                  >
                    {isLogin ? "Create account" : "Sign in"}
                  </button>
                </p>
              </div>
            </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
