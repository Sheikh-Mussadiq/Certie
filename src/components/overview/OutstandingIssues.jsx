import { Clock } from "lucide-react";

const OutstandingIssues = ({ logbooks }) => {
  const recentChanges = logbooks
    .flatMap((logbook) =>
      (logbook.logbook_entries || [])
        .filter((entry) => entry.completion_status === "Issue Identified")
        .map((entry) => ({
          ...entry,
          logbookName: logbook.logbook_type,
          logbookDescription: logbook.description,
        }))
    )
    .sort((a, b) => new Date(b.performed_at) - new Date(a.performed_at))
    .slice(0, 3);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center mb-4">
        <Clock size={20} className="text-gray-600 mr-2" />
        <h3 className="font-semibold text-gray-700">Outstanding Issues</h3>
        <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
          {recentChanges.length}
        </span>
      </div>
      <div className="space-y-3">
        {recentChanges.length > 0 ? (
          recentChanges.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <p className="font-semibold text-sm">{item.logbookName}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.completion_status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : item.completion_status === "Issue Identified"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.completion_status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {item.issue_comment || item.logbookDescription}
              </p>
              {item.performed_by && (
                <p className="text-xs text-gray-400">By: {item.performed_by}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent logbook changes.</p>
        )}
      </div>
    </div>
  );
};

export default OutstandingIssues;
