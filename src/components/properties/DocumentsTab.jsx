import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  ArrowDownToLine,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Shimmer from "../ui/Shimmer";
import CreateFolderModal from "./CreateFolderModal";
import UploadDocumentModal from "./UploadDocumentModal";
import FolderIcon from "../../assets/Folder.png";
import PDFIcon from "../../assets/PDF.png";
import DocIcon from "../../assets/Doc.png";
import {
  getDocumentFolders,
  getDocuments,
  getDocumentsByFolder,
  createDocumentFolder,
  deleteDocumentFolder,
  downloadDocument,
  deleteDocument,
  searchDocuments,
} from "../../services/documentServices";

const DocumentsTab = ({ owner_id }) => {
  const { id: propertyId } = useParams();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  useEffect(() => {
    if (propertyId) {
      fetchFoldersAndDocuments();
    }
  }, [propertyId]);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm]);

  // Clear recently added docs after some time
  useEffect(() => {
    if (recentlyAdded.length > 0) {
      const timer = setTimeout(() => {
        setRecentlyAdded([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [recentlyAdded]);

  const fetchFoldersAndDocuments = async () => {
    try {
      setLoading(true);

      // Fetch folders
      const foldersData = await getDocumentFolders(propertyId);
      setFolders(foldersData);

      // Fetch documents for each folder
      const documentsData = {};
      for (const folder of foldersData) {
        const folderDocuments = await getDocumentsByFolder(folder.id);
        documentsData[folder.id] = folderDocuments;
      }

      setDocuments(documentsData);
    } catch (error) {
      console.error("Error fetching folders and documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsSearching(true);
      const results = await searchDocuments(propertyId, searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching documents:", error);
      toast.error("Failed to search documents");
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFolder = async (folderId) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders((prev) => prev.filter((id) => id !== folderId));
    } else {
      setExpandedFolders((prev) => [...prev, folderId]);

      // Fetch documents for this folder if not already loaded
      if (!documents[folderId]) {
        try {
          const folderDocuments = await getDocumentsByFolder(folderId);
          setDocuments((prev) => ({
            ...prev,
            [folderId]: folderDocuments,
          }));
        } catch (error) {
          console.error("Error fetching folder documents:", error);
          toast.error("Failed to load folder documents");
        }
      }
    }
  };

  const handleCreateFolder = async (folderName) => {
    try {
      const newFolder = await createDocumentFolder(
        folderName,
        propertyId,
        currentUser.id
      );

      setFolders((prev) => [...prev, newFolder]);
      setDocuments((prev) => ({
        ...prev,
        [newFolder.id]: [],
      }));

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

  const handleUploadDocuments = async ({ files, folderId }) => {
    try {
      // Update local state directly
      if (files && files.length > 0) {
        // Add the new documents to the specific folder
        setDocuments((prev) => ({
          ...prev,
          [folderId]: [...(prev[folderId] || []), ...files],
        }));

        // Mark these documents as recently added for highlighting
        setRecentlyAdded(files.map((file) => file.id));

        // Expand the folder if not already expanded
        if (!expandedFolders.includes(folderId)) {
          setExpandedFolders((prev) => [...prev, folderId]);
        }

        toast.success(`${files.length} document(s) uploaded successfully`);
      }
    } catch (error) {
      console.error("Error handling uploaded documents:", error);
      toast.error("Failed to process uploaded documents");
    }
  };

  const handleDownloadDocument = async (document) => {
    try {
      await downloadDocument(document.file_path, document.name);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDeleteDocument = async (document) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await deleteDocument(document.id, document.file_path);

      // Update local state
      setDocuments((prev) => ({
        ...prev,
        [document.folder_id]: prev[document.folder_id].filter(
          (doc) => doc.id !== document.id
        ),
      }));

      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase();

    if (type.includes("pdf")) {
      return <img src={PDFIcon} alt="PDF" className="w-8 h-10" />;
    } else if (type.includes("word") || type.includes("doc")) {
      return <img src={DocIcon} alt="DOC" className="w-8 h-10" />;
    }

    // Default to PDF icon if type is unknown
    return <img src={PDFIcon} alt="File" className="w-8 h-10" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) {
      // Use a placeholder for missing file size
      return "File size unavailable";
    }
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Search and buttons shimmer */}
        <div className="flex items-center justify-between mb-8">
          <Shimmer className="h-10 w-64" />
          <div className="flex gap-3">
            <Shimmer className="h-10 w-32" />
            <Shimmer className="h-10 w-40" />
          </div>
        </div>

        {/* Folder shimmer */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-grey-outline p-2 rounded-xl overflow-hidden"
            >
              <div className="flex items-center p-3">
                <Shimmer className="h-5 w-5 mr-3" />
                <div className="flex justify-between items-center gap-3 w-full">
                  <div className="flex items-center gap-3">
                    <Shimmer className="h-8 w-8" />
                    <Shimmer className="h-5 w-32" />
                  </div>
                  <Shimmer className="h-6 w-16 rounded-full" />
                </div>
              </div>

              {i === 1 && (
                <div className="ml-8 mt-3 space-y-2">
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between p-3 m-2 bg-grey-fill/30 border border-grey-outline rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Shimmer className="h-10 w-8" />
                        <div>
                          <Shimmer className="h-4 w-48 mb-2" />
                          <Shimmer className="h-3 w-24" />
                        </div>
                      </div>
                      <Shimmer className="h-9 w-9 rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
          />
        </div>
        {currentUser.id === owner_id || currentUser.role === "super_admin" && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateFolderModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-primary-black border border-grey-outline rounded-lg hover:bg-grey-fill transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create folder
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-black rounded-lg hover:bg-primary-black/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm.trim() && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            Search Results{" "}
            {isSearching && (
              <span className="text-sm text-gray-500">(searching...)</span>
            )}
          </h3>
          {searchResults.length > 0 ? (
            <div className="space-y-1">
              {searchResults.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 hover:bg-grey-fill rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(document.file_type)}
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <p className="text-sm text-primary-grey">
                        Folder: {document.document_folders?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(document)}
                    className="text-sm text-primary-orange hover:underline"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !isSearching && (
              <p className="text-gray-500 text-center py-8">
                No documents found matching your search.
              </p>
            )
          )}
        </div>
      )}

      {/* Folders */}
      {!searchTerm.trim() && (
        <div className="space-y-1">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 1 }}
                whileHover={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                }}
                className="border border-grey-outline p-2 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-grey-fill rounded-xl"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      rotate: expandedFolders.includes(folder.id) ? 90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-5 h-5 text-primary-black" />
                  </motion.div>
                  <div className="flex justify-between items-center gap-3 w-full">
                    <div className="flex items-center gap-3">
                      <img src={FolderIcon} alt="Folder" className="w-8 h-8" />
                      <span className="font-medium flex-1">{folder.name}</span>
                    </div>

                    <span className="text-sm bg-grey-fill/50 border border-grey-outline shadow-sm rounded-full px-3 py-1 text-primary-black font-medium">
                      {documents[folder.id]?.length || 0} files
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedFolders.includes(folder.id) &&
                    documents[folder.id] && (
                      <motion.div
                        key={`folder-${folder.id}-content`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="ml-8 overflow-hidden"
                      >
                        {documents[folder.id].length > 0 ? (
                          documents[folder.id].map((document) => (
                            <motion.div
                              key={document.id}
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                              className={`flex items-center justify-between p-3 m-2 bg-grey-fill/50 border border-grey-outline rounded-lg shadow-sm ${
                                recentlyAdded.includes(document.id)
                                  ? "animate-pulse bg-green-50/50 border-green-200"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {getFileIcon(document.file_type)}
                                <div>
                                  <p className="font-medium">{document.name}</p>
                                  <p className="text-sm text-primary-grey flex items-center gap-2">
                                    {new Date(
                                      document.created_at
                                    ).toLocaleDateString()}
                                    <span className="w-1 h-1 bg-primary-grey rounded-full"></span>
                                    {document.size
                                      ? formatFileSize(document.size)
                                      : document.file_size
                                      ? formatFileSize(document.file_size)
                                      : "File size unavailable"}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownloadDocument(document)}
                                className="bg-white border border-grey-outline rounded-lg p-2 hover:bg-grey-fill shadow-sm"
                              >
                                <ArrowDownToLine className="w-5 h-5" />
                              </button>
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="p-3 text-center text-gray-500"
                          >
                            No documents in this folder
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-grey-fill rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No folders yet
              </h3>
              {(currentUser.id === owner_id || currentUser.role === "super_admin") && (
                <>
                <p className="text-gray-500 mb-4">
                  Create your first folder to organize documents
                </p>
              <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateFolderModalOpen(true)}
              className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors"
              >
                Create Folder
              </motion.button>
              </>
              )}
            </motion.div>
          )}
        </div>
      )}

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onSubmit={handleCreateFolder}
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadDocuments}
        folders={folders}
        propertyId={propertyId}
        currentUser={currentUser}
        onSuccess={null}
      />
    </div>
  );
};

export default DocumentsTab;
