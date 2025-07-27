import { List, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";

const RecentActivity = ({ logbooks, bookings }) => {
  // Get recent logbook activities
  const logbookActivities = logbooks.flatMap((logbook) =>
    (logbook.logbook_entries || []).map((entry) => ({
      ...entry,
      type: "logbook",
      logbookName: logbook.logbook_type,
      date: entry.performed_at,
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

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center mb-4">
        <List size={20} className="text-gray-600 mr-2" />
        <h3 className="font-semibold text-gray-700">Recent Activity</h3>
        <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
          {allActivities.length}
        </span>
      </div>
      <div className="space-y-4">
        {allActivities.length > 0 ? (
          allActivities.map((activity, index) => (
            <div
              key={activity.id || index}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 mt-1">
                {activity.type === "logbook" ? (
                  <FileText size={16} className="text-blue-600" />
                ) : (
                  <Calendar size={16} className="text-green-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm truncate">
                    {activity.type === "logbook"
                      ? activity.logbookName
                      : activity.title}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ml-2 ${
                      activity.type === "logbook"
                        ? activity.completion_status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : activity.completion_status === "Issue Identified"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        : activity.status === "assigned"
                        ? "bg-blue-100 text-blue-700"
                        : activity.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {activity.type === "logbook"
                      ? activity.completion_status
                      : activity.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {activity.type === "logbook"
                    ? activity.issue_comment || "Task completed"
                    : `${activity.property} • ${
                        activity.assignee || "Unassigned"
                      }`}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(activity.date), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
