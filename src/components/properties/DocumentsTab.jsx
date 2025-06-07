import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, ChevronDown, Download, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import CreateFolderModal from "./CreateFolderModal";
import UploadDocumentModal from "./UploadDocumentModal";
import {
  getDocumentFolders,
  getDocuments,
  getDocumentsByFolder,
  createDocumentFolder,
  deleteDocumentFolder,
  downloadDocument,
  deleteDocument,
  searchDocuments
} from "../../services/documentServices";

const DocumentsTab = () => {
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
      setExpandedFolders(prev => prev.filter(id => id !== folderId));
    } else {
      setExpandedFolders(prev => [...prev, folderId]);
      
      // Fetch documents for this folder if not already loaded
      if (!documents[folderId]) {
        try {
          const folderDocuments = await getDocumentsByFolder(folderId);
          setDocuments(prev => ({
            ...prev,
            [folderId]: folderDocuments
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
      
      setFolders(prev => [...prev, newFolder]);
      setDocuments(prev => ({
        ...prev,
        [newFolder.id]: []
      }));
      
      toast.success("Folder created successfully");
    } catch (error) {
      console.error("Error creating folder:", error);
      if (error.code === '23505') {
        toast.error("A folder with this name already exists");
      } else {
        toast.error("Failed to create folder");
      }
    }
  };

  const handleUploadDocuments = async ({ files, folderId }) => {
    try {
      // This will be handled by the UploadDocumentModal
      await fetchFoldersAndDocuments();
      toast.success(`${files.length} document(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Failed to upload documents");
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
      setDocuments(prev => ({
        ...prev,
        [document.folder_id]: prev[document.folder_id].filter(doc => doc.id !== document.id)
      }));
      
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase();
    let bgColor = "bg-blue-100";
    let textColor = "text-blue-700";
    let extension = type.toUpperCase();

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
    }

    return (
      <div className={`w-8 h-8 ${bgColor} rounded flex items-center justify-center`}>
        <span className={`text-xs font-medium ${textColor}`}>
          {extension}
        </span>
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
      </div>

      {/* Search Results */}
      {searchTerm.trim() && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            Search Results {isSearching && <span className="text-sm text-gray-500">(searching...)</span>}
          </h3>
          {searchResults.length > 0 ? (
            <div className="border border-grey-outline rounded-lg overflow-hidden">
              {searchResults.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 hover:bg-grey-fill border-b border-grey-outline last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(document.file_type)}
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <p className="text-sm text-primary-grey">
                        Folder: {document.document_folders?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadDocument(document)}
                      className="p-2 text-gray-400 hover:text-primary-orange rounded-full hover:bg-primary-orange/10 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(document)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : !isSearching && (
            <p className="text-gray-500 text-center py-8">No documents found matching your search.</p>
          )}
        </div>
      )}

      {/* Folders */}
      {!searchTerm.trim() && (
        <div className="space-y-2">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <div
                key={folder.id}
                className="border border-grey-outline rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-grey-fill"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-orange/10 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-orange">
                        📁
                      </span>
                    </div>
                    <span className="font-medium">{folder.name}</span>
                    <span className="text-sm text-primary-grey">
                      {documents[folder.id]?.length || 0} files
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFolders.includes(folder.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFolders.includes(folder.id) && documents[folder.id] && (
                  <div className="border-t border-grey-outline divide-y divide-grey-outline">
                    {documents[folder.id].length > 0 ? (
                      documents[folder.id].map((document) => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between p-4 hover:bg-grey-fill"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(document.file_type)}
                            <div>
                              <p className="font-medium">{document.name}</p>
                              <p className="text-sm text-primary-grey">
                                Created: {new Date(document.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownloadDocument(document)}
                              className="p-2 text-gray-400 hover:text-primary-orange rounded-full hover:bg-primary-orange/10 transition-colors"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(document)}
                              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No documents in this folder
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-grey-fill rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No folders yet</h3>
              <p className="text-gray-500 mb-4">Create your first folder to organize documents</p>
              <button
                onClick={() => setIsCreateFolderModalOpen(true)}
                className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors"
              >
                Create Folder
              </button>
            </div>
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
        onSuccess={fetchFoldersAndDocuments}
      />
    </div>
  );
};

export default DocumentsTab;