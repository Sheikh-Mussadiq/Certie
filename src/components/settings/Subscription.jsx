import { motion } from "framer-motion";
import { useState } from "react";
import { CreditCard, Calendar, DollarSign, Crown } from "lucide-react";
import { toast } from "react-hot-toast";

const Subscription = () => {
  const [subscription, setSubscription] = useState({
    plan: "Premium",
    status: "Active",
    nextBilling: "December 15, 2024",
    amount: "$29.99",
    cycle: "month",
    features: [
      "Unlimited properties",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
    ],
  });

  const handleManageSubscription = async () => {
    try {
      // TODO: Implement subscription management
      toast.info("Redirecting to subscription management...");
    } catch (error) {
      toast.error("Failed to open subscription management");
    }
  };

  const handleUpgrade = async () => {
    try {
      // TODO: Implement upgrade functionality
      toast.info("Redirecting to upgrade page...");
    } catch (error) {
      toast.error("Failed to process upgrade");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-primary-black">Subscription</h3>

      {/* Current Plan Card */}
      <div className="p-6 border border-grey-outline rounded-lg bg-grey-fill">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-primary-orange" />
            <div>
              <h4 className="font-medium text-primary-black">Current Plan</h4>
              <p className="text-sm text-primary-grey">
                {subscription.plan} Plan
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              subscription.status === "Active"
                ? "bg-primary-green text-white"
                : "bg-primary-red text-white"
            }`}
          >
            {subscription.status}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-primary-grey" />
            <span className="text-primary-grey">
              Next billing date: {subscription.nextBilling}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-primary-grey" />
            <span className="text-primary-grey">
              Amount: {subscription.amount}/{subscription.cycle}
            </span>
          </div>
        </div>

        <button
          onClick={handleManageSubscription}
          className="mt-4 px-6 py-2 bg-primary-black text-white rounded-lg hover:bg-secondary-black transition-colors"
        >
          Manage Subscription
        </button>
      </div>

      {/* Plan Features */}
      <div className="space-y-4">
        <h4 className="font-medium text-primary-black">Plan Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subscription.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-green rounded-full"></div>
              <span className="text-sm text-primary-grey">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="p-6 border border-grey-outline rounded-lg bg-white">
        <h4 className="font-medium text-primary-black mb-3">Upgrade Options</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-grey-outline rounded-lg">
            <div>
              <h5 className="font-medium text-primary-black">
                Enterprise Plan
              </h5>
              <p className="text-sm text-primary-grey">
                Advanced features for large organizations
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Subscription;
