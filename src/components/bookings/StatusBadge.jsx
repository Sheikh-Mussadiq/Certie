import React from "react";
import { Eye, FileText, Lock } from "lucide-react";

const StatusBadge = ({ status }) => {
  let badgeClasses =
    "inline-flex items-center px-4 py-2 rounded-md  text-xs font-medium";
  let icon = null;
  let text = "";

  switch (status) {
    case "completed":
      badgeClasses +=
        " bg-green-50 text-primary-green border border-primary-green/50 ";
      icon = <Eye className="w-4 h-4 mr-1.5" />;
      text = "See Report";
      break;
    case "pending":
      badgeClasses +=
        " bg-orange-50 text-primary-orange border border-primary-orange/50";
      icon = <FileText className="w-4 h-4 mr-1.5" />;
      text = "Report Pending";
      break;
    case "locked":
      badgeClasses +=
        " bg-red-50 text-primary-red border border-primary-red/50";
      icon = <Lock className="w-4 h-4 mr-1.5" />;
      text = "Report Locked";
      break;
    default:
      badgeClasses +=
        " bg-gray-100 text-primary-grey border border-primary-grey/50";
      text = status;
  }

  return (
    <span className={badgeClasses}>
      {icon}
      {text}
    </span>
  );
};

export default StatusBadge;
