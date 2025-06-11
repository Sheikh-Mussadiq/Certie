import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Trash2,
  FolderIcon,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import PDFIcon from "../../assets/PDF.png";
import DocIcon from "../../assets/Doc.png";
import FolderImg from "../../assets/Folder.png";
import {
  uploadDocumentFile,
  createDocument,
} from "../../services/documentServices";

const UploadDocumentModal = ({
  isOpen,
  onClose,
  onSubmit,
  folders,
  propertyId,
  currentUser,
  onSuccess,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [step, setStep] = useState(1); // Step 1: Select folder, Step 2: Upload files

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejection) => {
        const { file, errors } = rejection;
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast.error(
              `File "${file.name}" is too large. Maximum size is 10MB.`
            );
          } else if (error.code === "file-invalid-type") {
            toast.error(`File "${file.name}" has an invalid type.`);
          } else {
            toast.error(`Error with file "${file.name}": ${error.message}`);
          }
        });
      });
    }

    // Add accepted files
    if (acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/plain": [".txt"],
      "application/zip": [".zip"],
      "application/x-rar-compressed": [".rar"],
    },
    maxSize: 10485760, // 10MB
    multiple: true,
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFolder || files.length === 0) {
      toast.error("Please select a folder and add at least one file");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedDocuments = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          // Update progress
          setUploadProgress((prev) => ({
            ...prev,
            [i]: { status: "uploading", progress: 0 },
          }));

          // Upload file to storage
          const { filePath, publicUrl } = await uploadDocumentFile(
            file,
            propertyId,
            currentUser.id
          );

          // Update progress
          setUploadProgress((prev) => ({
            ...prev,
            [i]: { status: "uploading", progress: 50 },
          }));

          // Create document record
          const documentData = {
            name: file.name,
            folder_id: selectedFolder,
            property_id: propertyId,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            created_by: currentUser.id,
          };

          const document = await createDocument(documentData);
          uploadedDocuments.push(document);

          // Update progress
          setUploadProgress((prev) => ({
            ...prev,
            [i]: { status: "completed", progress: 100 },
          }));
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          setUploadProgress((prev) => ({
            ...prev,
            [i]: { status: "error", progress: 0 },
          }));
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedDocuments.length > 0) {
        await onSubmit({ files: uploadedDocuments, folderId: selectedFolder });
        handleClose();
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Failed to upload documents");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFiles([]);
      setSelectedFolder("");
      setUploadProgress({});
      setStep(1);
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase();

    if (type.includes("pdf")) {
      return <img src={PDFIcon} alt="PDF" className="w-10 h-12" />;
    } else if (type.includes("word") || type.includes("doc")) {
      return <img src={DocIcon} alt="DOC" className="w-10 h-12" />;
    } else if (type.includes("image")) {
      return (
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-green-600" />
        </div>
      );
    } else if (type.includes("excel") || type.includes("sheet")) {
      return (
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-green-600" />
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-gray-600" />
        </div>
      );
    }
  };

  if (!isOpen) return null;

  const nextStep = () => {
    if (selectedFolder) {
      setStep(2);
    } else {
      toast.error("Please select a folder first");
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-grey-outline px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary-orange/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary-orange" />
                </div>
                <h2 className="text-xl font-semibold text-primary-black">
                  {step === 1 ? "Select Folder" : "Upload Documents"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="p-2 hover:bg-grey-fill rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-primary-grey" />
              </button>
            </div>

            {/* Steps indicator */}
            <div className="px-6 pt-4 pb-0">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 1
                        ? "bg-primary-orange text-white"
                        : "bg-grey-fill text-primary-grey"
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      step >= 1
                        ? "text-primary-black font-medium"
                        : "text-primary-grey"
                    }`}
                  >
                    Select Folder
                  </span>
                </div>
                <div
                  className={`flex-1 mx-4 h-0.5 ${
                    step >= 2 ? "bg-primary-orange" : "bg-grey-fill"
                  }`}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 2
                        ? "bg-primary-orange text-white"
                        : "bg-grey-fill text-primary-grey"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      step >= 2
                        ? "text-primary-black font-medium"
                        : "text-primary-grey"
                    }`}
                  >
                    Upload Files
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-primary-black">
                          Select a folder to upload documents to:
                        </label>
                        <div className="space-y-2 mt-4">
                          {folders.map((folder) => (
                            <motion.div
                              key={folder.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`p-3 border rounded-xl cursor-pointer transition-all ${
                                selectedFolder === folder.id
                                  ? "border-primary-orange bg-primary-orange/5"
                                  : "border-grey-outline hover:border-primary-orange/50"
                              }`}
                              onClick={() => setSelectedFolder(folder.id)}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={FolderImg}
                                  alt="Folder"
                                  className="w-8 h-8"
                                />
                                <span className="font-medium">
                                  {folder.name}
                                </span>
                                {selectedFolder === folder.id && (
                                  <div className="ml-auto bg-primary-orange text-white rounded-full p-1">
                                    <Check className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}

                          {folders.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-grey-outline rounded-xl">
                              <div className="w-16 h-16 bg-grey-fill rounded-full flex items-center justify-center mx-auto mb-4">
                                <FolderIcon className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500">
                                No folders available
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                Create a folder first to upload documents
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mb-4">
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                            ${
                              isDragActive
                                ? "border-primary-orange bg-primary-orange/5"
                                : "border-grey-outline hover:border-primary-orange/50"
                            }
                            ${
                              isUploading
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          `}
                        >
                          <input {...getInputProps()} disabled={isUploading} />
                          <motion.div
                            initial={{ scale: 1 }}
                            animate={{
                              scale: isDragActive ? 1.05 : 1,
                              y: isDragActive ? -5 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mb-4">
                              <Upload className="w-8 h-8 text-primary-orange" />
                            </div>
                            <p className="text-base font-medium text-primary-black">
                              {isDragActive
                                ? "Drop files here..."
                                : "Drag & drop files here"}
                            </p>
                            <p className="text-sm text-primary-grey mt-1">
                              or{" "}
                              <span className="text-primary-orange underline">
                                browse files
                              </span>
                            </p>
                            <p className="text-xs text-primary-grey mt-4 px-6 py-2 bg-grey-fill rounded-full">
                              PDF, Images, Documents up to 10MB each
                            </p>
                          </motion.div>
                        </div>
                      </div>

                      {files.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-2"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-primary-black">
                              Files to Upload
                            </h3>
                            <span className="text-xs text-primary-grey bg-grey-fill px-2 py-1 rounded-full">
                              {files.length}{" "}
                              {files.length === 1 ? "file" : "files"}
                            </span>
                          </div>

                          {files.map((file, index) => {
                            const progress = uploadProgress[index];
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 p-3 bg-grey-fill rounded-xl relative overflow-hidden"
                              >
                                {progress &&
                                  progress.status === "uploading" && (
                                    <motion.div
                                      className="absolute bottom-0 left-0 h-1 bg-primary-orange"
                                      initial={{ width: "0%" }}
                                      animate={{
                                        width: `${progress.progress}%`,
                                      }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  )}

                                {getFileIcon(file.type)}

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-primary-black">
                                    {file.name}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs text-primary-grey">
                                      {formatFileSize(file.size)}
                                    </p>

                                    {progress && (
                                      <>
                                        {progress.status === "uploading" && (
                                          <span className="text-xs text-primary-orange flex items-center gap-1">
                                            <div className="w-2 h-2 bg-primary-orange rounded-full animate-pulse"></div>
                                            Uploading... {progress.progress}%
                                          </span>
                                        )}

                                        {progress.status === "completed" && (
                                          <span className="text-xs text-green-600 flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Uploaded
                                          </span>
                                        )}

                                        {progress.status === "error" && (
                                          <span className="text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Failed
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {!isUploading && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="p-1.5 text-primary-grey hover:text-red-500 hover:bg-red-50 rounded-full"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                )}
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Footer with action buttons */}
            <div className="border-t border-grey-outline px-6 py-4 flex justify-between items-center">
              {step === 1 ? (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isUploading}
                    className="px-4 py-2 text-primary-grey hover:text-primary-black hover:bg-grey-fill rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedFolder}
                    className="px-5 py-2.5 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next
                  </motion.button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isUploading}
                    className="px-4 py-2 text-primary-grey hover:text-primary-black hover:bg-grey-fill rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isUploading || files.length === 0}
                    className="px-5 py-2.5 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>
                          Upload {files.length > 0 && `(${files.length})`}
                        </span>
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadDocumentModal;
