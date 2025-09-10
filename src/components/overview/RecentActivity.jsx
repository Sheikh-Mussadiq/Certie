import { List, Calendar, FileText } from "lucide-react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const RecentActivity = ({ logbooks, bookings }) => {
  const navigate = useNavigate();

  // Get recent logbook activities
  const logbookActivities = logbooks.flatMap((logbook) =>
    (logbook.logbook_entries || []).map((entry) => ({
      ...entry,
      type: "logbook",
      logbookName: logbook.logbook_type,
      date: entry.performed_at,
      property_id: logbook.property_id,
      propertyName: logbook.property?.name || "Unknown Property",
    }))
  );

  // Get recent booking activities
  const bookingActivities = bookings
    .filter((booking) => booking.status !== "completed")
    .map((booking) => ({
      type: "booking",
      id: booking.id,
      title: booking.type,
      property: booking.properties?.name,
      status: booking.status,
      date: booking.assessment_time,
      assignee: booking.assignee?.name,
    }));

  // Combine and sort all activities
  const allActivities = [...logbookActivities, ...bookingActivities]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const handleActivityClick = (activity) => {
    if (activity.type === "logbook" && activity.property_id) {
      navigate(`/properties/${activity.property_id}/logbooks`);
    } else if (activity.type === "booking") {
      navigate("/bookings");
    }
  };

  const handleViewAllClick = () => {
    // Navigate to a general activity or properties page
    navigate("/properties");
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-grey-fill/50 border border-grey-outline mr-2">
            <ListAltIcon size={20} className="text-primary-grey" />
          </div>
          <h3 className="font-semibold text-lg text-secondary-black">
            Recent Activity
          </h3>
          <span className="ml-2 bg-grey-fill/50 text-secondary-black text-xs font-semibold px-2 py-1 rounded-full border border-grey-outline">
            {allActivities.length}
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
      <div className="space-y-4">
        {allActivities.length > 0 ? (
          allActivities.map((activity, index) => (
            <div
              key={activity.id || index}
              onClick={() => handleActivityClick(activity)}
              className="flex items-start space-x-3 p-3 rounded-lg bg-grey-fill/50 hover:bg-grey-fill cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              {/* <div className="flex-shrink-0 mt-1">
                {activity.type === "logbook" ? (
                  <FileText size={16} className="text-blue-600" />
                ) : (
                  <Calendar size={16} className="text-green-600" />
                )}
              </div> */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm truncate">
                      {activity.type === "logbook"
                        ? activity.logbookName
                        : activity.title}
                    </p>
                    <div>
                      {activity.type === "logbook" ? (
                        <>
                          <p className="text-sm text-gray-500 truncate w-72 overflow-hidden">
                            {activity.issue_comment || "Task completed"}
                          </p>
                          <p className="text-xs text-gray-400 truncate w-72 overflow-hidden">
                            {activity.propertyName}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 truncate w-72 overflow-hidden">
                          {`${activity.property} • ${activity.assignee || "Unassigned"}`}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {format(new Date(activity.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <span
                      className={`text-xs px-2 py-1 rounded-md border ml-2 ${
                        activity.type === "logbook"
                          ? activity.completion_status === "Completed"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : activity.completion_status === "Issue Identified"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : activity.status === "assigned"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {activity.type === "logbook"
                        ? activity.completion_status
                        : activity.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <ListAltIcon className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500">No recent activity.</p>
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

export default RecentActivity;
