import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  // Lock,
  // Settings as SettingsIcon,
  // CreditCard,
  // Palette,
} from "lucide-react";
import Profile from "../components/settings/Profile";
// import ResetPassword from "../components/settings/ResetPassword";
// import AccountSettings from "../components/settings/AccountSettings";
// import Subscription from "../components/settings/Subscription";
// import Appearance from "../components/settings/Appearance";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const navigationItems = [
    { id: "profile", label: "Profile", icon: User },
    // { id: "password", label: "Reset Password", icon: Lock },
    // { id: "account", label: "Account Settings", icon: SettingsIcon },
    // { id: "subscription", label: "Subscription", icon: CreditCard },
    // { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const renderProfileTab = () => <Profile />;

  // const renderPasswordTab = () => <ResetPassword />;

  // const renderAccountTab = () => <AccountSettings />;

  // const renderSubscriptionTab = () => <Subscription />;

  // const renderAppearanceTab = () => <Appearance />;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      // case "password":
      //   return renderPasswordTab();
      // case "account":
      //   return renderAccountTab();
      // case "subscription":
      //   return renderSubscriptionTab();
      // case "appearance":
      //   return renderAppearanceTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="flex h-full bg-white rounded-2xl">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-grey-outline p-6">
        <h2 className="text-xl font-bold text-primary-black mb-6">
          Manage User
        </h2>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-primary-grey mb-3">
            General
          </h3>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-grey-fill text-secondary-black"
                    : "text-primary-grey hover:text-secondary-black"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary-black">
              {navigationItems.find((item) => item.id === activeTab)?.label}
            </h1>
            <p className="text-primary-grey mt-1">
              Manage and optimize your business
            </p>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
