import StatusBadge from "./StatusBadge";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BookingDetailsModal from "./BookingDetailsModal";
import { useAuth } from "../../context/AuthContext";

const BookingList = ({ bookings, onBookingUpdate }) => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleBookingUpdate = (updatedBooking) => {
    if (onBookingUpdate) {
      onBookingUpdate(updatedBooking);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-grey-outline overflow-hidden">
      <table className="min-w-full divide-y divide-grey-outline">
        <thead className="bg-grey-fill">
          <tr>
            {/* <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider w-12 border-r border-grey-outline"
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-orange rounded"
              />
            </th> */}
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-semibold text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Service
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-semibold text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Property
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-semibold text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Contact Details
            </th>
            {/* <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Last Checked
            </th> */}
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-semibold text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-semibold text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Invoice
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-semibold text-primary-grey uppercase tracking-wider border-r border-grey-outline"
            >
              Assessor Details
            </th>
            {currentUser.role === "super_admin" && (
              <th
                scope="col"
                className="px-6 py-3 text-center text-sm font-semibold text-primary-grey uppercase tracking-wider border-r border-grey-outline"
              >
                {/* <span className="px-6 py-3 text-left text-xs font-medium text-primary-grey uppercase tracking-wider  border-grey-outline"> */}
                Actions
                {/* </span> */}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-grey-outline">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-grey-fill">
              {/* <td className="px-6 py-4 whitespace-nowrap border-r border-grey-outline">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-orange rounded border-grey-outline"
                />
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-black border-r border-grey-outline">
                {booking.type ||
                  (booking.service_name ? booking.service_name : "N/A")}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-sm text-primary-black border-r border-grey-outline hover:cursor-pointer hover:text-primary-orange hover:underline"
                onClick={() => {
                  navigate(`/properties/${booking.property_id}`);
                }}
              >
                {booking.properties?.name || booking.property_name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-black border-r border-grey-outline">
                {booking.contact_details ? (
                  <div className="space-y-1">
                    <div className="font-medium">
                      Name: {booking.contact_details.name || "-"}
                    </div>
                    <div className="text-xs text-primary-grey">
                      <div>Email: {booking.contact_details.email || "-"}</div>
                      <div>Phone: {booking.contact_details.phone || "-"}</div>
                      <div className="truncate max-w-xs">
                        Address: {booking.contact_details.address || "-"}
                      </div>
                    </div>
                  </div>
                ) : (
                  "-"
                )}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-black border-r border-grey-outline">
                {booking.completed_at
                  ? format(new Date(booking.completed_at), "dd MMM - yyyy")
                  : booking.assessment_time
                  ? format(new Date(booking.assessment_time), "dd MMM - yyyy")
                  : "N/A"}
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap border-r border-grey-outline">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-grey-outline">
                {booking.invoice_bookings &&
                booking.invoice_bookings.length > 0 ? (
                  <div>
                    <p className="font-medium">
                      {booking.invoice_bookings[0].invoices.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      £{booking.invoice_bookings[0].invoices.amount_due / 100}
                    </p>
                    <a
                      href={
                        booking.invoice_bookings[0].invoices.hosted_invoice_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View Invoice
                    </a>
                  </div>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-grey-outline">
                <div className="flex items-center">
                  {/* <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full"></div> */}
                  <div className="ml-3">
                    <div className="text-sm font-medium text-primary-black">
                      {booking.assignee?.name || "No Assessor Assigned"}
                    </div>
                    {booking.assignee?.contact && (
                      <div className="text-xs text-primary-grey">
                        {booking.assignee.contact}
                      </div>
                    )}
                    {booking.assignee?.email && (
                      <div className="text-xs text-primary-grey">
                        {booking.assignee.email}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              {currentUser.role === "super_admin" && (
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    className="text-primary-grey hover:text-primary-black"
                    onClick={() => handleOpenModal(booking)}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
        onUpdate={handleBookingUpdate}
      />
    </div>
  );
};

export default BookingList;
