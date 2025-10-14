import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WatchLater } from "@mui/icons-material";
import { getLogbooksWithEntries } from "../../services/logbookservices";

const OutstandingIssuesTab = () => {
  const { property } = useOutletContext();
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        setLoading(true);

        // Fetch logbooks with entries for the current property using the service
        const propertyLogbooks = await getLogbooksWithEntries(property.id);

        // Add property details to each logbook
        const logbooksWithProperty = propertyLogbooks.map((logbook) => ({
          ...logbook,
          property: property,
        }));

        setLogbooks(logbooksWithProperty);
      } catch (error) {
        console.error("Error fetching logbooks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (property?.id) {
      fetchLogbooks();
    }
  }, [property]);

  // Filter and transform logbook entries with issues
  const outstandingIssues = logbooks
    .flatMap((logbook) =>
      (logbook.logbook_entries || [])
        .filter((entry) => entry.completion_status === "Issue Identified")
        .map((entry) => ({
          ...entry,
          logbookName: logbook.logbook_type,
          logbookDescription: logbook.description,
          propertyName: property.name || "Unknown Property",
        }))
    )
    .sort((a, b) => new Date(b.performed_at) - new Date(a.performed_at));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 rounded-lg bg-grey-fill/50 border border-grey-outline mr-2 sm:mr-3">
          <WatchLater fontSize="small" className="text-primary-grey sm:text-[28px]" />
        </div>
        <h2 className="text-base sm:text-xl font-semibold text-secondary-black">
          Outstanding Issues
        </h2>
        <span className="ml-2 bg-grey-fill/50 text-secondary-black text-xs sm:text-sm font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-grey-outline">
          {outstandingIssues.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-6 sm:p-8">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-blue"></div>
        </div>
      ) : outstandingIssues.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {outstandingIssues.map((issue, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 p-3 sm:p-4 rounded-lg bg-grey-fill/50 border border-grey-outline"
            >
              <div className="flex flex-col justify-between items-start space-y-2 min-w-0 flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full">
                  <p className="font-semibold text-sm sm:text-base truncate">{issue.logbookName}</p>
                  <span className="text-xs text-primary-grey whitespace-nowrap">
                    {formatDate(issue.performed_at)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 w-full">
                  {issue.issue_comment || issue.logbookDescription}
                </p>

                {issue.performed_by && (
                  <p className="text-xs text-gray-500 truncate w-full">
                    Reported by: {issue.performed_by}
                  </p>
                )}
              </div>

              <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md bg-red-100 text-red-700 border border-red-200 whitespace-nowrap self-end sm:self-auto flex-shrink-0">
                {issue.completion_status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 sm:p-8 text-sm sm:text-base text-gray-500 bg-grey-fill/30 rounded-lg">
          <p>No outstanding issues found for this property.</p>
        </div>
      )}
    </div>
  );
};

export default OutstandingIssuesTab;
