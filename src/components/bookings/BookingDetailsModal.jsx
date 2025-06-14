import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";
import { updateBooking } from "../../services/bookingServices";

const BookingDetailsModal = ({ isOpen, onClose, booking, onUpdate }) => {
  const [formData, setFormData] = useState({
    assigneeName: "",
    assigneeContact: "",
    assigneeEmail: "",
    assessmentTime: "",
    status: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (booking) {
      setFormData({
        assigneeName: booking.assignee?.name || "",
        assigneeContact: booking.assignee?.contact || "",
        assigneeEmail: booking.assignee?.email || "",
        assessmentTime: booking.assessment_time 
          ? new Date(booking.assessment_time).toISOString().slice(0, 16)
          : "",
        status: booking.status || ""
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.assigneeName || !formData.assessmentTime || !formData.status) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const updateData = {
        assignee: {
          name: formData.assigneeName,
          contact: formData.assigneeContact,
          email: formData.assigneeEmail
        },
        assessment_time: new Date(formData.assessmentTime).toISOString(),
        status: formData.status
      };

      updateData.status === "cancelled" && (updateData.completed_at = null);
      updateData.status === "completed" && (updateData.completed_at = new Date().toISOString());
      const updatedBooking = await updateBooking(booking.id, updateData);
      onUpdate(updatedBooking);
      onClose();
    } catch (error) {
      console.error("Error updating booking:", error);
      setError("Failed to update booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const statusOptions = [
    { value: "approved", label: "Approved" },
    { value: "assigned", label: "Assigned" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-grey-outline px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary-orange/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-orange" />
                </div>
                <h2 className="text-xl font-semibold text-primary-black">
                  Booking Details
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-grey-fill rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-primary-grey" />
              </button>
            </div>

            <div className="px-6 py-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  {/* Assignee Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-primary-black">
                      Assignee Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-primary-grey" />
                      </div>
                      <input
                        type="text"
                        name="assigneeName"
                        value={formData.assigneeName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                        placeholder="Enter assignee name"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Assignee Contact */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-primary-black">
                      Contact Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-primary-grey" />
                      </div>
                      <input
                        type="text"
                        name="assigneeContact"
                        value={formData.assigneeContact}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>
                  
                  {/* Assignee Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-primary-black">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-primary-grey" />
                      </div>
                      <input
                        type="email"
                        name="assigneeEmail"
                        value={formData.assigneeEmail}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  
                  {/* Assessment Time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-primary-black">
                      Assessment Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-primary-grey" />
                      </div>
                      <input
                        type="datetime-local"
                        name="assessmentTime"
                        value={formData.assessmentTime}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Status Update */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-primary-black">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                      required
                    >
                      <option value="" disabled>Select status</option>
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-grey-outline">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-lg border border-grey-outline hover:bg-grey-fill transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                      {isSubmitting ? "Updating..." : "Update Booking"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
