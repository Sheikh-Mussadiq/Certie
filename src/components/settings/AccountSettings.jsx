import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, Bell, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

const AccountSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorEnabled: false,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleTwoFactorToggle = async () => {
    try {
      // TODO: Implement 2FA toggle functionality
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      handleToggle("twoFactorEnabled");
      toast.success(settings.twoFactorEnabled ? "2FA disabled" : "2FA enabled");
    } catch (error) {
      toast.error("Failed to update 2FA settings");
    }
  };

  const handleNotificationToggle = async (setting) => {
    try {
      // TODO: Implement notification toggle functionality
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      handleToggle(setting);
      toast.success(
        `${setting === "emailNotifications" ? "Email" : "SMS"} notifications ${
          settings[setting] ? "disabled" : "enabled"
        }`
      );
    } catch (error) {
      toast.error("Failed to update notification settings");
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
        Account Settings
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-grey-outline rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-primary-orange" />
            <div>
              <h4 className="font-medium text-primary-black">
                Email Notifications
              </h4>
              <p className="text-sm text-primary-grey">
                Receive email updates about your account
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleNotificationToggle("emailNotifications")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-grey-outline peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-orange"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-grey-outline rounded-lg">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-primary-orange" />
            <div>
              <h4 className="font-medium text-primary-black">
                SMS Notifications
              </h4>
              <p className="text-sm text-primary-grey">
                Receive SMS updates about your account
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={() => handleNotificationToggle("smsNotifications")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-grey-outline peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-orange"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-grey-outline rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-primary-orange" />
            <div>
              <h4 className="font-medium text-primary-black">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-primary-grey">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <button
            onClick={handleTwoFactorToggle}
            className={`px-4 py-2 rounded-lg transition-colors ${
              settings.twoFactorEnabled
                ? "bg-primary-red text-white hover:bg-red-600"
                : "bg-primary-orange text-white hover:bg-red-600"
            }`}
          >
            {settings.twoFactorEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettings;
