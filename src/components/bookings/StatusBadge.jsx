import React from "react";
import { FileX, FileCheck, Lock, CircleDotDashed, Calendar } from "lucide-react";

const StatusBadge = ({ status }) => {
  let badgeClasses =
    "inline-flex items-center px-4 py-2 rounded-md  text-xs font-medium";
  let icon = null;
  let text = "";

  switch (status) {
    case "completed":
      badgeClasses +=
        " bg-green-50 text-primary-green border border-primary-green/50 ";
      icon = <FileCheck className="w-4 h-4 mr-1.5" />;
      text = "Assessment Completed";
      break;
    case "approved":
      badgeClasses +=
        " bg-orange-50 text-primary-orange border border-primary-orange/50";
      icon = <CircleDotDashed className="w-4 h-4 mr-1.5" />;
      text = "Pending Assignment";
      break;
    case "assigned":
      badgeClasses +=
        " bg-blue-50 text-blue-600 border border-blue-600/50";
      icon = <Calendar className="w-4 h-4 mr-1.5" />;
      text = "Assigned for Assessment";
      break;
    case "cancelled":
      badgeClasses +=
        " bg-red-50 text-primary-red border border-primary-red/50";
      icon = <FileX className="w-4 h-4 mr-1.5" />;
      text = "Assessment Cancelled";
      break;
    default:
      badgeClasses +=
        " bg-gray-100 text-primary-grey border border-primary-grey/50";
      text = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <span className={badgeClasses}>
      {icon}
      {text}
    </span>
  );
};

export default StatusBadge;
