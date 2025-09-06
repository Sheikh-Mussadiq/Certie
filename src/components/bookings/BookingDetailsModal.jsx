import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Mail, Clock, Plus, Upload, Folder, FileText, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { updateBooking } from "../../services/bookingServices";
import { 
  getDocumentFolders, 
  createDocumentFolder, 
  uploadDocumentFile, 
  createDocument 
} from "../../services/documentServices";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const BookingDetailsModal = ({ isOpen, onClose, booking, onUpdate }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    assigneeName: "",
    assigneeContact: "",
    assigneeEmail: "",
    assessmentTime: "",
    status: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Document upload states
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);

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
      
      // Reset document upload states when booking changes
      setShowDocumentUpload(false);
      setDocumentsUploaded(false);
      setFiles([]);
      setSelectedFolder("");
    }
  }, [booking]);

  // Fetch folders when document upload is shown
  useEffect(() => {
    if (showDocumentUpload && booking?.property_id) {
      fetchFolders();
    }
  }, [showDocumentUpload, booking?.property_id]);

  const fetchFolders = async () => {
    try {
      const foldersData = await getDocumentFolders(booking.property_id);
      setFolders(foldersData);
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error("Failed to load folders");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If status is changed to completed, show document upload interface
    if (name === "status" && value === "completed") {
      setShowDocumentUpload(true);
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
      return;
    }

    // If status is changed to approved or cancelled, reset all fields except status
    if (name === "status" && (value === "approved" || value === "cancelled")) {
      setFormData({
        assigneeName: "",
        assigneeContact: "",
        assigneeEmail: "",
        assessmentTime: "",
        status: value
      });
      setShowDocumentUpload(false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      const newFolder = await createDocumentFolder(
        newFolderName,
        booking.property_id,
        currentUser.id
      );
      
      setFolders(prev => [...prev, newFolder]);
      setSelectedFolder(newFolder.id);
      setNewFolderName("");
      setShowCreateFolder(false);
      toast.success("Folder created successfully");
    } catch (error) {
      console.error("Error creating folder:", error);
      if (error.code === "23505") {
        toast.error("A folder with this name already exists");
      } else {
        toast.error("Failed to create folder");
      }
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUploadDocuments = async () => {
    if (!selectedFolder) {
      toast.error("Please select a folder");
      return;
    }

    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    try {
      setIsUploading(true);

      for (const file of files) {
        // Upload file to storage
        const { filePath } = await uploadDocumentFile(
          file,
          booking.property_id,
          currentUser.id
        );

        // Create document record
        await createDocument({
          name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          folder_id: selectedFolder,
          property_id: booking.property_id,
          created_by: currentUser.id,
        });
      }

      setDocumentsUploaded(true);
      toast.success(`${files.length} document(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Failed to upload documents");
    } finally {
      setIsUploading(false);
    }
  };

  const allFieldsFilled =
    formData.assigneeName &&
    formData.assigneeContact &&
    formData.assigneeEmail &&
    formData.assessmentTime &&
    formData.status;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // If trying to complete without uploading documents, prevent submission
    if (formData.status === "completed" && !documentsUploaded) {
      setError("Please upload completion documents before marking as completed");
      return;
    }

    // All fields are required except for status "approved" or "cancelled"
    if (
      (formData.status !== "approved" && formData.status !== "cancelled") &&
      (
        !formData.assigneeName ||
        !formData.assigneeContact ||
        !formData.assigneeEmail ||
        !formData.assessmentTime ||
        !formData.status
      )
    ) {
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
        assessment_time: formData.assessmentTime
          ? new Date(formData.assessmentTime).toISOString()
          : null,
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
      setShowDocumentUpload(false);
      setDocumentsUploaded(false);
      setFiles([]);
      setSelectedFolder("");
      onClose();
    }
  };

  const handleBackFromDocuments = () => {
    setShowDocumentUpload(false);
    setFormData(prev => ({ ...prev, status: "" }));
  };

  const statusOptions = [
    { value: "approved", label: "Approved" },
    { value: "assigned", label: "Assigned" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  // Check if all fields are present in the original booking
  const bookingHasAllFields =
    booking &&
    booking.assignee?.name &&
    booking.assignee?.contact &&
    booking.assignee?.email &&
    booking.assessment_time;

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
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-grey-outline px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {showDocumentUpload && (
                  <button
                    onClick={handleBackFromDocuments}
                    className="p-2 hover:bg-grey-fill rounded-full transition-colors mr-2"
                  >
                    <ArrowLeft className="w-5 h-5 text-primary-grey" />
                  </button>
                )}
                <div className="bg-primary-orange/10 w-10 h-10 rounded-full flex items-center justify-center">
                  {showDocumentUpload ? (
                    <Upload className="w-5 h-5 text-primary-orange" />
                  ) : (
                    <Calendar className="w-5 h-5 text-primary-orange" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-primary-black">
                  {showDocumentUpload ? "Upload Completion Documents" : "Booking Details"}
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

            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {showDocumentUpload ? (
                // Document Upload Interface
                <div className="px-6 py-6">
                  <div className="mb-6">
                    <p className="text-sm text-primary-grey mb-4">
                      Please upload the completion documents for this booking before marking it as completed.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}

                  {/* Folder Selection */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-primary-black">
                        Select Folder <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => setShowCreateFolder(!showCreateFolder)}
                        className="text-sm text-primary-orange hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Create New Folder
                      </button>
                    </div>

                    {showCreateFolder && (
                      <div className="bg-grey-fill/30 p-4 rounded-lg border border-grey-outline">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter folder name"
                            className="flex-1 px-3 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                          />
                          <button
                            onClick={handleCreateFolder}
                            className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    )}

                    <select
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="block w-full px-3 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                      required
                    >
                      <option value="">Select a folder</option>
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-primary-black">
                      Upload Documents <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-grey-outline rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <FileText className="w-8 h-8 text-primary-grey" />
                        <p className="text-sm text-primary-grey">
                          Click to select files or drag and drop
                        </p>
                        <p className="text-xs text-primary-grey">
                          PDF, DOC, DOCX, JPG, PNG files
                        </p>
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Selected Files:</p>
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-primary-grey">
                            <FileText className="w-4 h-4" />
                            <span>{file.name}</span>
                            <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={handleUploadDocuments}
                    disabled={!selectedFolder || files.length === 0 || isUploading}
                    className="w-full px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Documents
                      </>
                    )}
                  </button>

                  {documentsUploaded && (
                    <div className="mt-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                      Documents uploaded successfully! You can now complete the booking.
                    </div>
                  )}

                  {/* Complete Booking Button */}
                  {documentsUploaded && (
                    <div className="mt-6 pt-4 border-t border-grey-outline">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? "Completing..." : "Mark Booking as Completed"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Original Booking Form
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
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-primary-grey" />
                          </div>
                          <input
                            type="text"
                            name="assigneeContact"
                            pattern="[+0-9]+"
                            value={formData.assigneeContact}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^[+0-9]+$/.test(value)) {
                                handleChange(e);
                              }
                            }}
                            className="block w-full pl-10 pr-3 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                            placeholder="Enter contact number"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Assignee Email */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary-black">
                          Email Address <span className="text-red-500">*</span>
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
                            required
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
                            min={new Date().toISOString().slice(0, 16)}
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
                          <option value="approved">Approved</option>
                          <option
                            value="assigned"
                            disabled={
                              !formData.assigneeName ||
                              !formData.assigneeContact ||
                              !formData.assigneeEmail ||
                              !formData.assessmentTime
                            }
                          >
                            Assigned
                          </option>
                          <option
                            value="completed"
                            disabled={!bookingHasAllFields}
                          >
                            Completed
                          </option>
                          <option value="cancelled">Cancelled</option>
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
                          disabled={isSubmitting || (formData.status === "completed" && !documentsUploaded)}
                          className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                          {isSubmitting ? "Updating..." : "Update Booking"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
