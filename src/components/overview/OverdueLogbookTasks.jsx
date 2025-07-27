import { AlertTriangle } from "lucide-react";
import { isPast, addDays, parseISO } from "date-fns";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full";
  const statusClasses = {
    Critical: "bg-red-100 text-red-700",
    Minor: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const OverdueLogbookTasks = ({ logbooks }) => {
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

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center mb-4">
        <AlertTriangle size={20} className="text-gray-600 mr-2" />
        <h3 className="font-semibold text-gray-700">Overdue Logbook Tasks</h3>
        <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
          {overdueTasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {overdueTasks.length > 0 ? (
          overdueTasks.map((task, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">{task.logbook_type}</p>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <StatusBadge status="Critical" />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No overdue logbook tasks.</p>
        )}
      </div>
    </div>
  );
};

export default OverdueLogbookTasks;
