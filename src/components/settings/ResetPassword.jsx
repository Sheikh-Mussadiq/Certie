import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement password reset functionality
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-primary-black">
        Reset Password
      </h3>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-grey">
            Current Password
          </label>
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) =>
              handleInputChange("currentPassword", e.target.value)
            }
            required
            className="w-full px-3 py-2 border border-grey-outline rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="Enter your current password"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-grey">
            New Password
          </label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            required
            className="w-full px-3 py-2 border border-grey-outline rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="Enter your new password"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-grey">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            required
            className="w-full px-3 py-2 border border-grey-outline rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="Confirm your new password"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-black text-white rounded-lg hover:bg-secondary-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </motion.div>
  );
};

export default ResetPassword;
