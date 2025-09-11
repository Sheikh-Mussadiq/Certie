"use client";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

import { Button } from "./button";
import { cn } from "../../lib/utils";

const variantStyles = {
  default: "bg-white border-border text-foreground",
  success: "bg-white border-green-600/50",
  error: "bg-white border-destructive/50",
  warning: "bg-white border-amber-600/50",
};

const titleColor = {
  default: "text-foreground",
  success: "text-green-600 dark:text-green-400",
  error: "text-destructive",
  warning: "text-amber-600 dark:text-amber-400",
};

const iconColor = {
  default: "text-muted-foreground",
  success: "text-green-600 dark:text-green-400",
  error: "text-destructive",
  warning: "text-amber-600 dark:text-amber-400",
};

const variantIcons = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const toastAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 },
};

const CustomToast = ({ t, title, message, actions }) => {
  // Determine variant from react-hot-toast type
  const variant =
    t.type === "success"
      ? "success"
      : t.type === "error" || t.error
      ? "error"
      : "default";
  const Icon = variantIcons[variant];

  return (
    <motion.div
      variants={toastAnimation}
      initial="initial"
      animate={t.visible ? "animate" : "exit"}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex items-center justify-between w-full max-w-xs p-3 rounded-xl border shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start gap-2">
        <Icon
          className={cn("h-4 w-4 mt-0.5 flex-shrink-0", iconColor[variant])}
        />
        <div className="space-y-0.5">
          <h3
            className={cn(
              "text-xs font-medium leading-none",
              titleColor[variant]
            )}
          >
            {title || variant.charAt(0).toUpperCase() + variant.slice(1)}
          </h3>
          <p className="text-xs text-muted-foreground">
            {message || t.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions?.label && (
          <Button
            variant={actions.variant || "outline"}
            size="sm"
            onClick={() => {
              actions.onClick();
              toast.dismiss(t.id);
            }}
            className={cn(
              "cursor-pointer",
              variant === "success"
                ? "text-green-600 border-green-600 hover:bg-green-600/10 dark:hover:bg-green-400/20"
                : variant === "error"
                ? "text-destructive border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                : variant === "warning"
                ? "text-amber-600 border-amber-600 hover:bg-amber-600/10 dark:hover:bg-amber-400/20"
                : "text-foreground border-border hover:bg-muted/10 dark:hover:bg-muted/20"
            )}
          >
            {actions.label}
          </Button>
        )}

        <button
          onClick={() => toast.dismiss(t.id)}
          className="rounded-full p-1 hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Dismiss notification"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
};

export default CustomToast;
