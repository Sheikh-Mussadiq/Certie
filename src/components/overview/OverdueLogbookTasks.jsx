import { AlertTriangle } from "lucide-react";
import WarningIcon from "@mui/icons-material/Warning";
import { isPast, addDays, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-md border";
  const statusClasses = {
    Critical: "bg-red-100 text-red-700 border-red-200",
    Minor: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const OverdueLogbookTasks = ({ logbooks }) => {
  const navigate = useNavigate();

  const overdueTasks = logbooks
    .filter((logbook) => {
      if (!logbook.entries || logbook.entries.length === 0) return true; // Overdue if no entries

      const lastEntry = logbook.entries[0];
      if (lastEntry.completion_status !== "Completed") return true;

      const nextDueDate = addDays(
        parseISO(lastEntry.performed_at),
        logbook.frequency
      );
      return isPast(nextDueDate);
    })
    .slice(0, 3);

  const handleTaskClick = (logbook) => {
    if (logbook.property_id) {
      navigate(`/properties/${logbook.property_id}/logbooks`);
    }
  };

  const handleViewAllClick = () => {
    // Navigate to properties page with logbooks filter if possible
    navigate("/properties");
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-grey-fill/50 border border-grey-outline mr-2">
            <WarningIcon className="text-primary-grey" />
          </div>
          <h3 className="font-semibold text-lg text-secondary-black">
            Overdue Logbook Tasks
          </h3>
          <span className="ml-2 bg-grey-fill/50 text-secondary-black text-xs font-semibold px-2 py-1 rounded-full border border-grey-outline">
            {overdueTasks.length}
          </span>
        </div>
        {/* <button
          onClick={handleViewAllClick}
          className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-sm border border-grey-outline text-secondary-black hover:bg-grey-fill transition-colors text-sm"
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button> */}
      </div>
      <div className="space-y-3">
        {overdueTasks.length > 0 ? (
          overdueTasks.map((task, index) => (
            <div
              key={index}
              onClick={() => handleTaskClick(task)}
              className="flex justify-between items-center p-3 rounded-lg bg-grey-fill/50 hover:bg-grey-fill cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-sm">{task.logbook_type}</p>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <StatusBadge status="Critical" />
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <WarningIcon className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500">No overdue logbook tasks.</p>
            <button
              onClick={handleViewAllClick}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View all properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueLogbookTasks;
