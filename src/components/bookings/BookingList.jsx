import StatusBadge from "./StatusBadge";
import {
  MoreHorizontal,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  SquarePen,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BookingDetailsModal from "./BookingDetailsModal";
import { useAuth } from "../../context/AuthContext";

const BookingList = ({ bookings, onBookingUpdate }) => {
  const renderServiceDetails = (booking) => {
    const serviceName =
      booking.type ||
      (booking.service_name
        ? Array.isArray(booking.service_name)
          ? booking.service_name.join(", ")
          : booking.service_name
        : "N/A");
    const meta = booking.meta;
    let metaDetails = [];

    if (meta) {
      if (meta.devices) {
        metaDetails.push(`${meta.devices} devices`);
      }
      if (meta.doors) {
        metaDetails.push(`${meta.doors} doors`);
      }
      if (meta.fraMeta && meta.fraMeta.label) {
        metaDetails.push(meta.fraMeta.label);
      }
    }

    return (
      <div>
        <div>{serviceName}</div>
        {metaDetails.length > 0 && (
          <div className="text-xs text-primary-grey">
            {metaDetails.join(", ")}
          </div>
        )}
      </div>
    );
  };
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();

  // Status styling function similar to Invoices.jsx
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-primary-green/10 text-primary-green border-primary-green/30";
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "draft":
        return "bg-grey-fill text-primary-grey border-grey-outline";
      case "void":
        return "bg-primary-red/10 text-primary-red border-primary-red/30";
      default:
        return "bg-grey-fill text-primary-grey border-grey-outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "open":
        return <Clock className="w-4 h-4" />;
      case "draft":
        return <FileText className="w-4 h-4" />;
      case "void":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };
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
      <div className="overflow-x-auto">
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
              Details
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
                {renderServiceDetails(booking)}
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
                        Additional Info:{" "}
                        {booking.contact_details.additionalInfo || "-"}
                      </div>
                      <div className="truncate max-w-xs font-bold text-primary-black">
                      Booking Date: {booking.booked_time ? format(new Date(booking.booked_time), "dd MMM - yyyy") : "-"}
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
                    {/* Updated invoice status with styling to match Invoices page */}
                    <div className="mb-2">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md border ${getStatusColor(
                          booking.invoice_bookings[0].invoices.status
                        )}`}
                      >
                        {getStatusIcon(
                          booking.invoice_bookings[0].invoices.status
                        )}
                        {booking.invoice_bookings[0].invoices.status
                          .charAt(0)
                          .toUpperCase() +
                          booking.invoice_bookings[0].invoices.status.slice(1)}
                      </span>
                    </div>
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
                    {booking?.assessment_time && (
                      <div className="text-xs font-bold text-primary-black">
                        Assessment Date: {booking.assessment_time ? format(new Date(booking.assessment_time), "dd MMM - yyyy") : "-"}
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
                    <SquarePen className="h-5 w-5" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

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
