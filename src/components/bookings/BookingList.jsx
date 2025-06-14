
import StatusBadge from "./StatusBadge";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const BookingList = ({ bookings }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-grey-outline overflow-hidden">
      <table className="min-w-full divide-y divide-grey-outline">
        <thead className="bg-grey-fill">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider w-12 border-r border-grey-outline"
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-orange rounded"
              />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Service
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Property
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Last Checked
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Assessor Details
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-grey-outline">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-grey-fill">
              <td className="px-6 py-4 whitespace-nowrap border-r border-grey-outline">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-orange rounded border-grey-outline"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-black border-r border-grey-outline">
                {booking.type ||
                  (booking.service_name ? booking.service_name : "N/A")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-black border-r border-grey-outline hover:cursor-pointer hover:text-primary-orange" onClick={() => {navigate(`/properties/${booking.property_id}`)}}>
                {booking.properties?.name || booking.property_name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-black border-r border-grey-outline">
                {booking.completed_at
                  ? format(new Date(booking.completed_at), "dd MMM - yyyy")
                  : booking.booking_time
                  ? format(new Date(booking.booking_time), "dd MMM - yyyy")
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-grey-outline">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-grey-outline">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-primary-black">
                      {booking.assignee?.name || "Assigned Assessor"}
                    </div>
                    {booking.assignee?.contact && (
                      <div className="text-xs text-primary-grey">
                        {booking.assignee.contact}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-primary-grey hover:text-primary-black">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
