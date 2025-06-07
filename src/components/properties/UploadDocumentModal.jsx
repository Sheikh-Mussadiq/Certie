// import { useState, useCallback } from "react";
// import { motion } from "framer-motion";
// import { X, Upload } from "lucide-react";
// import { useDropzone } from "react-dropzone";

// const UploadDocumentModal = ({ isOpen, onClose, onSubmit, folders }) => {
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [files, setFiles] = useState([]);

//   const onDrop = useCallback((acceptedFiles) => {
//     setFiles(acceptedFiles);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/pdf": [".pdf"],
//       "image/jpeg": [".jpg", ".jpeg"],
//       "image/png": [".png"],
//     },
//     maxSize: 10485760, // 10MB
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ files, folderId: selectedFolder });
//     setFiles([]);
//     setSelectedFolder("");
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         className="bg-white rounded-xl w-full max-w-lg p-6"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Upload Documents</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-grey-fill rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-2">
//               Select Folder
//             </label>
//             <select
//               value={selectedFolder}
//               onChange={(e) => setSelectedFolder(e.target.value)}
//               className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
//               required
//             >
//               <option value="">Select a folder</option>
//               {folders.map((folder) => (
//                 <option key={folder.id} value={folder.id}>
//                   {folder.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-6">
//             <div
//               {...getRootProps()}
//               className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
//                 ${
//                   isDragActive
//                     ? "border-primary-orange bg-red-50"
//                     : "border-grey-outline hover:border-primary-orange"
//                 }`}
//             >
//               <input {...getInputProps()} />
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <p className="mt-2 text-sm text-gray-600">
//                 Drag & drop files here, or click to select
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 PDF, JPG, PNG up to 10MB
//               </p>
//             </div>

//             {files.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 {files.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 bg-grey-fill rounded-lg"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-primary-orange/10 rounded flex items-center justify-center">
//                         <span className="text-xs font-medium text-primary-orange">
//                           {file.name.split(".").pop().toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">{file.name}</p>
//                         <p className="text-xs text-primary-grey">
//                           {(file.size / (1024 * 1024)).toFixed(2)} MB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setFiles(files.filter((_, i) => i !== index))
//                       }
//                       className="text-gray-400 hover:text-red-500"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-primary-black hover:bg-grey-fill rounded-lg transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={!selectedFolder || files.length === 0}
//               className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Upload
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default UploadDocumentModal;


import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Upload, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import {
  uploadDocumentFile,
  createDocument
} from "../../services/documentServices";

const UploadDocumentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  folders, 
  propertyId, 
  currentUser,
  onSuccess 
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejection) => {
        const { file, errors } = rejection;
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`File "${file.name}" has an invalid type.`);
          } else {
            toast.error(`Error with file "${file.name}": ${error.message}`);
          }
        });
      });
    }

    // Add accepted files
    if (acceptedFiles.length > 0) {
      setFiles(prev => [...prev, ...acceptedFiles]);
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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/plain": [".txt"],
      "application/zip": [".zip"],
      "application/x-rar-compressed": [".rar"]
    },
    maxSize: 10485760, // 10MB
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
          setUploadProgress(prev => ({
            ...prev,
            [i]: { status: 'uploading', progress: 0 }
          }));

          // Upload file to storage
          const { filePath, publicUrl } = await uploadDocumentFile(
            file, 
            propertyId, 
            currentUser.id
          );

          // Update progress
          setUploadProgress(prev => ({
            ...prev,
            [i]: { status: 'uploading', progress: 50 }
          }));

          // Create document record
          const documentData = {
            name: file.name,
            folder_id: selectedFolder,
            property_id: propertyId,
            file_path: filePath,
            file_type: file.type,
            created_by: currentUser.id
          };

          const document = await createDocument(documentData);
          uploadedDocuments.push(document);

          // Update progress
          setUploadProgress(prev => ({
            ...prev,
            [i]: { status: 'completed', progress: 100 }
          }));

        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          setUploadProgress(prev => ({
            ...prev,
            [i]: { status: 'error', progress: 0 }
          }));
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedDocuments.length > 0) {
        await onSubmit({ files: uploadedDocuments, folderId: selectedFolder });
        if (onSuccess) {
          await onSuccess();
        }
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
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase();
    let bgColor = "bg-blue-100";
    let textColor = "text-blue-700";
    let extension = type.split('/')[1]?.toUpperCase() || 'FILE';

    if (type.includes("pdf")) {
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      extension = "PDF";
    } else if (type.includes("image")) {
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      extension = "IMG";
    } else if (type.includes("word") || type.includes("doc")) {
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      extension = "DOC";
    } else if (type.includes("excel") || type.includes("sheet")) {
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      extension = "XLS";
    } else if (type.includes("text")) {
      bgColor = "bg-gray-100";
      textColor = "text-gray-700";
      extension = "TXT";
    }

    return (
      <div className={`w-8 h-8 ${bgColor} rounded flex items-center justify-center flex-shrink-0`}>
        <span className={`text-xs font-medium ${textColor}`}>
          {extension.slice(0, 3)}
        </span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upload Documents</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 hover:bg-grey-fill rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Folder *
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
              required
              disabled={isUploading}
            >
              <option value="">Choose a folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Documents
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-primary-orange bg-red-50"
                    : "border-grey-outline hover:border-primary-orange"
                }
                ${isUploading ? "pointer-events-none opacity-50" : ""}
              `}
            >
              <input {...getInputProps()} disabled={isUploading} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag & drop files here, or click to select"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, Images, Documents up to 10MB each
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => {
                  const progress = uploadProgress[index];
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-grey-fill rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-primary-grey">
                            {formatFileSize(file.size)}
                          </p>
                          {progress && (
                            <div className="mt-1">
                              {progress.status === 'uploading' && (
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-primary-orange h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${progress.progress}%` }}
                                  ></div>
                                </div>
                              )}
                              {progress.status === 'completed' && (
                                <span className="text-xs text-green-600">✓ Uploaded</span>
                              )}
                              {progress.status === 'error' && (
                                <span className="text-xs text-red-600">✗ Failed</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="px-4 py-2 text-primary-black hover:bg-grey-fill rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFolder || files.length === 0}
              className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {files.length > 0 && `(${files.length})`}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UploadDocumentModal;