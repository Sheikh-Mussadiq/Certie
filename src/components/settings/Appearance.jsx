import { motion } from "framer-motion";
import { useState } from "react";
import { Palette, Globe, Layout } from "lucide-react";
import { toast } from "react-hot-toast";

const Appearance = () => {
  const [appearance, setAppearance] = useState({
    theme: "Light",
    language: "English",
    compactMode: false,
    fontSize: "Medium",
  });

  const handleSettingChange = async (setting, value) => {
    try {
      // TODO: Implement appearance setting updates
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setAppearance((prev) => ({
        ...prev,
        [setting]: value,
      }));
      toast.success(
        `${
          setting === "theme"
            ? "Theme"
            : setting === "language"
            ? "Language"
            : "Setting"
        } updated successfully`
      );
    } catch (error) {
      toast.error("Failed to update setting");
    }
  };

  const handleToggle = async (setting) => {
    try {
      // TODO: Implement toggle functionality
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API call
      setAppearance((prev) => ({
        ...prev,
        [setting]: !prev[setting],
      }));
      toast.success(
        `${setting === "compactMode" ? "Compact mode" : "Setting"} ${
          appearance[setting] ? "disabled" : "enabled"
        }`
      );
    } catch (error) {
      toast.error("Failed to update setting");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-primary-black">Appearance</h3>
      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary-orange" />
            <label className="text-sm font-medium text-primary-grey">
              Theme
            </label>
          </div>
          <select
            value={appearance.theme}
            onChange={(e) => handleSettingChange("theme", e.target.value)}
            className="w-full px-3 py-2 border border-grey-outline rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="System">System</option>
          </select>
        </div>

        {/* Language Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-primary-orange" />
            <label className="text-sm font-medium text-primary-grey">
              Language
            </label>
          </div>
          <select
            value={appearance.language}
            onChange={(e) => handleSettingChange("language", e.target.value)}
            className="w-full px-3 py-2 border border-grey-outline rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-primary-grey">
            Font Size
          </label>
          <select
            value={appearance.fontSize}
            onChange={(e) => handleSettingChange("fontSize", e.target.value)}
            className="w-full px-3 py-2 border border-grey-outline rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
        </div>

        {/* Compact Mode Toggle */}
        <div className="flex items-center justify-between p-4 border border-grey-outline rounded-lg">
          <div className="flex items-center space-x-3">
            <Layout className="w-5 h-5 text-primary-orange" />
            <div>
              <h4 className="font-medium text-primary-black">Compact Mode</h4>
              <p className="text-sm text-primary-grey">
                Use a more compact layout
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={appearance.compactMode}
              onChange={() => handleToggle("compactMode")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-grey-outline peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-orange"></div>
          </label>
        </div>

        {/* Preview Section */}
        <div className="p-4 border border-grey-outline rounded-lg bg-grey-fill">
          <h4 className="font-medium text-primary-black mb-3">Preview</h4>
          <div className="space-y-2">
            <p className="text-sm text-primary-grey">
              Current theme:{" "}
              <span className="font-medium text-primary-black">
                {appearance.theme}
              </span>
            </p>
            <p className="text-sm text-primary-grey">
              Language:{" "}
              <span className="font-medium text-primary-black">
                {appearance.language}
              </span>
            </p>
            <p className="text-sm text-primary-grey">
              Font size:{" "}
              <span className="font-medium text-primary-black">
                {appearance.fontSize}
              </span>
            </p>
            <p className="text-sm text-primary-grey">
              Compact mode:{" "}
              <span className="font-medium text-primary-black">
                {appearance.compactMode ? "Enabled" : "Disabled"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Appearance;
