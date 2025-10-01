import { AlertTriangle, CalendarIcon } from "lucide-react";
import WarningIcon from "@mui/icons-material/Warning";
import { isPast, addDays, parseISO, formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-md border";
  const statusClasses = {
    Overdue: "bg-red-100 text-red-700 border-red-200",
    "Due Soon": "bg-orange-100 text-orange-700 border-orange-200",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const LogbookTasks = ({ logbooks }) => {
  const navigate = useNavigate();

  const frequencyToDays = {
    Daily: 1,
    Weekly: 7,
    Monthly: 30,
    Quarterly: 90,
    Annually: 365,
    "Every 6 months": 180,
    "Every 2 years": 730,
    "Every 3 years": 1095,
    "Every 5 years": 1825,
  };

  const processLogbooks = (logbooks) => {
    const tasks = [];
    logbooks.forEach((logbook) => {
      const entries = logbook.logbook_entries || logbook.entries || [];
      if (entries.length === 0) return;

      const sortedEntries = entries.sort(
        (a, b) => new Date(b.performed_at) - new Date(a.performed_at)
      );
      const lastEntry = sortedEntries[0];

      if (
        lastEntry.completion_status !== "Working Correctly" &&
        lastEntry.completion_status !== "Completed"
      ) {
        tasks.push({ ...logbook, status: "Overdue", dueDate: null }); // Has an incomplete task
        return;
      }

      const frequencyDays = frequencyToDays[logbook.frequency] || 30;
      const nextDueDate = addDays(
        parseISO(lastEntry.performed_at),
        frequencyDays
      );

      if (isPast(nextDueDate)) {
        tasks.push({ ...logbook, status: "Overdue", dueDate: nextDueDate });
      } else if (isPast(addDays(nextDueDate, -7))) {
        // Due in the next 7 days
        tasks.push({ ...logbook, status: "Due Soon", dueDate: nextDueDate });
      }
    });
    return tasks;
  };

  const allTasks = processLogbooks(logbooks);
  // .slice(0, 3);

  const handleTaskClick = (logbook) => {
    if (logbook.property_id && logbook.id) {
      navigate(`/properties/${logbook.property_id}/logbooks/${logbook.id}`);
    }
  };

  const handleViewAllClick = () => {
    // Navigate to properties page with logbooks filter if possible
    navigate("/logbooks");
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-grey-fill/50 border border-grey-outline mr-2">
            <CalendarIcon className="text-primary-grey" />
          </div>
          <h3 className="font-semibold text-lg text-secondary-black">
            Logbook Tasks
          </h3>
          <span className="ml-2 bg-grey-fill/50 text-secondary-black text-xs font-semibold px-2 py-1 rounded-full border border-grey-outline">
            {allTasks.length}
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
      <div className="space-y-3 max-h-[390px] overflow-y-auto">
        {allTasks.length > 0 ? (
          allTasks.map((task, index) => (
            <div
              key={index}
              onClick={() => handleTaskClick(task)}
              className="flex justify-between items-center p-3 rounded-lg bg-grey-fill/50 hover:bg-grey-fill cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-sm">{task.logbook_type}</p>
                <p className="text-sm text-gray-500">
                  {task.property?.name || "Unknown Property"}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {task.status === "Overdue" ? "Due " : "Due in "}
                    {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                     ({format(task.dueDate, "dd MMM yyyy")})
                  </p>
                )}
              </div>
              <StatusBadge status={task.status} />
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <CalendarIcon className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500">
              No overdue or upcoming logbook tasks.
            </p>
            <button
              onClick={handleViewAllClick}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View all logbooks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogbookTasks;
