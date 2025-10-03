import { Clock } from "lucide-react";
import WatchLaterIcon from "@mui/icons-material/WatchLater";

const OutstandingIssues = ({ logbooks }) => {
  const recentChanges = logbooks
    .flatMap((logbook) =>
      (logbook.logbook_entries || [])
        .filter((entry) => entry.completion_status === "Issue Identified")
        .map((entry) => ({
          ...entry,
          logbookName: logbook.logbook_type,
          logbookDescription: logbook.description,
          propertyName: logbook.property?.name || "Unknown Property",
        }))
    )
    .sort((a, b) => new Date(b.performed_at) - new Date(a.performed_at))
    .slice(0, 3);

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-grey-fill/50 border border-grey-outline mr-2">
          <WatchLaterIcon size={20} className="text-primary-grey" />
        </div>
        <h3 className="font-semibold text-lg text-secondary-black">
          Outstanding Issues
        </h3>
        <span className="ml-2 bg-grey-fill/50 text-secondary-black text-xs font-semibold px-2 py-1 rounded-full border border-grey-outline">
          {recentChanges.length}
        </span>
      </div>
      <div className="space-y-3">
        {recentChanges.length > 0 ? (
          recentChanges.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-2 p-2 rounded-lg bg-grey-fill/50"
            >
              <div className="flex flex-col justify-between items-start space-y-1 flex-1 min-w-0">

                <p className="font-semibold text-sm">{item.logbookName}</p>
                <p className="text-xs font-semibold"> Property: {item.propertyName}</p>

                <p className="text-sm text-gray-500 truncate max-w-full">
                  {item.issue_comment || item.logbookDescription}
                </p>
                {item.performed_by && (
                  <p className="text-xs text-gray-400 truncate max-w-full">
                    By: {item.performed_by}
                  </p>
                )}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-md border flex-shrink-0 whitespace-nowrap ${
                  item.completion_status === "Completed"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : item.completion_status === "Issue Identified"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                }`}
              >
                {item.completion_status}
              </span>
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
