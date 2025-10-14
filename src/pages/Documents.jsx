import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  ArrowDownToLine,
  FolderOpen,
  ChevronDown,
  SortAsc,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Shimmer from "../components/ui/Shimmer";
import FolderIcon from "../assets/Folder.png";
import PDFIcon from "../assets/PDF.png";
import DocIcon from "../assets/Doc.png";
import {
  getAllDocumentsGroupedByProperty,
  downloadDocument,
} from "../services/documentServices";
import { Link } from "react-router-dom";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProperties, setExpandedProperties] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({}); // { propertyId: [folderId1, folderId2] }
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [sortBy, setSortBy] = useState("name-asc");
  const [filterByType, setFilterByType] = useState("all");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    let processedData = [...data];

    if (filterByType !== "all") {
      processedData = processedData
        .map((property) => {
          if (!property.folders) return null;
          const filteredFolders = property.folders
            .map((folder) => {
              if (!folder.documents) return null;
              const filteredDocs = folder.documents.filter(
                (doc) =>
                  doc.file_type &&
                  doc.file_type.toLowerCase().includes(filterByType)
              );
              return filteredDocs.length > 0
                ? { ...folder, documents: filteredDocs }
                : null;
            })
            .filter(Boolean);
          return filteredFolders.length > 0
            ? { ...property, folders: filteredFolders }
            : null;
        })
        .filter(Boolean);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      processedData = processedData
        .map((property) => {
          if (!property.folders) return null;
          const searchFolders = property.folders
            .map((folder) => {
              if (!folder.documents) return null;
              const searchDocs = folder.documents.filter((doc) =>
                doc.name.toLowerCase().includes(query)
              );
              return searchDocs.length > 0
                ? { ...folder, documents: searchDocs }
                : null;
            })
            .filter(Boolean);
          return searchFolders.length > 0
            ? { ...property, folders: searchFolders }
            : null;
        })
        .filter(Boolean);
    }

    const [sortKey, sortOrder] = sortBy.split("-");
    processedData.forEach((property) => {
      if (property.folders) {
        property.folders.forEach((folder) => {
          if (folder.documents) {
            folder.documents.sort((a, b) => {
              let valA, valB;
              if (sortKey === "name") {
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
              } else if (sortKey === "date") {
                valA = new Date(a.created_at);
                valB = new Date(b.created_at);
              } else if (sortKey === "size") {
                valA = a.size || 0;
                valB = b.size || 0;
              } else {
                return 0;
              }

              if (valA < valB) return sortOrder === "asc" ? -1 : 1;
              if (valA > valB) return sortOrder === "asc" ? 1 : -1;
              return 0;
            });
          }
        });
      }
    });

    setFilteredData(processedData);
  }, [data, searchTerm, sortBy, filterByType]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const documentsData = await getAllDocumentsGroupedByProperty();
      setData(documentsData);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
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

  const toggleProperty = (propertyId) => {
    setExpandedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const toggleFolder = (propertyId, folderId) => {
    setExpandedFolders((prev) => {
      const currentExpanded = prev[propertyId] || [];
      return {
        ...prev,
        [propertyId]: currentExpanded.includes(folderId)
          ? currentExpanded.filter((id) => id !== folderId)
          : [...currentExpanded, folderId],
      };
    });
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("pdf"))
      return <img src={PDFIcon} alt="PDF" className="w-8 h-10" />;
    if (type.includes("word") || type.includes("doc"))
      return <img src={DocIcon} alt="DOC" className="w-8 h-10" />;
    return <img src={PDFIcon} alt="File" className="w-8 h-10" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  if (loading) {
    return <Shimmer />; // Replace with a more specific shimmer if needed
  }

  const sortOptions = {
    "name-asc": "Name (A-Z)",
    "name-desc": "Name (Z-A)",
    "date-desc": "Date (Newest)",
    "date-asc": "Date (Oldest)",
  };

  const filterOptions = {
    all: "All Types",
    pdf: "PDF",
    doc: "Word Document",
    // Add more types here e.g. 'image', 'spreadsheet'
  };

  return (
    <div className="">
      <h1 className="text-xl sm:text-2xl font-bold mb-2">All Documents</h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        Browse and manage documents across all your properties.
      </p>

      <div className="bg-white rounded-xl p-3 sm:p-4 border border-grey-outline shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-primary-black hover:bg-grey-fill rounded-lg border border-grey-outline whitespace-nowrap"
              >
                <SortAsc className="w-4 h-4" />
                <span className="hidden sm:inline">Sort by: {sortOptions[sortBy]}</span>
                <span className="sm:hidden">Sort</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 left-0 sm:right-0 sm:left-auto mt-2 w-48 bg-white rounded-lg shadow-lg border border-grey-outline"
                  >
                    {Object.entries(sortOptions).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSortBy(value);
                          setSortOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-primary-black hover:bg-grey-fill first:rounded-t-lg last:rounded-b-lg"
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-primary-black hover:bg-grey-fill rounded-lg border border-grey-outline whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter: {filterOptions[filterByType]}</span>
                <span className="sm:hidden">Filter</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-grey-outline"
                  >
                    {Object.entries(filterOptions).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => {
                          setFilterByType(value);
                          setFilterOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-primary-black hover:bg-grey-fill first:rounded-t-lg last:rounded-b-lg"
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredData.length > 0 ? (
            filteredData.map((property) => (
              <motion.div
                key={property.id}
                className="border border-grey-outline p-1.5 sm:p-2 rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleProperty(property.id)}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-grey-fill rounded-xl"
                >
                  <motion.div
                    animate={{
                      rotate: expandedProperties.includes(property.id) ? 90 : 0,
                    }}
                    className="flex-shrink-0"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary-orange flex-shrink-0" />
                  <Link
                    to={`/properties/${property.id}`}
                    className="font-medium text-sm sm:text-base md:text-lg hover:underline truncate flex-1 min-w-0 text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {property.name}
                  </Link>
                  {property.folders && property.folders.length > 0 && (
                    <span className="text-xs sm:text-sm bg-grey-fill/50 border border-grey-outline shadow-sm rounded-full px-2 sm:px-3 py-0.5 sm:py-1 ml-auto flex-shrink-0">
                      {property.folders.length}{" "}
                      <span className="hidden sm:inline">{property.folders.length === 1 ? "folder" : "folders"}</span>
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {expandedProperties.includes(property.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-4 sm:ml-8 relative"
                    >
                      {property.folders.map((folder, index) => (
                        <div key={folder.id} className="py-2 relative">
                          {/* Curved connector line */}
                          <div className="absolute left-0 top-0 bottom-0 w-5">
                            <svg
                              className="absolute left-0 top-0 w-5 h-10"
                              viewBox="0 0 20 40"
                              fill="none"
                            >
                              <path
                                d="M0 0 L0 24 Q0 32 10 32 L20 32"
                                stroke="rgb(229 231 235)"
                                strokeWidth="1"
                                fill="none"
                              />
                            </svg>
                            {/* Vertical line for non-last items */}
                            {index < property.folders.length - 1 && (
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-grey-outline"></div>
                            )}
                          </div>
                          <button
                            onClick={() => toggleFolder(property.id, folder.id)}
                            className="w-[98%] flex items-center gap-2 sm:gap-3 p-2 hover:bg-grey-fill rounded-lg ml-2 sm:ml-4"
                          >
                            <motion.div
                              animate={{
                                rotate: expandedFolders[property.id]?.includes(
                                  folder.id
                                )
                                  ? 90
                                  : 0,
                              }}
                              className="flex-shrink-0"
                            >
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.div>
                            <img
                              src={FolderIcon}
                              alt="Folder"
                              className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                            />
                            <span className="font-medium text-sm sm:text-base truncate flex-1 min-w-0 text-left">{folder.name}</span>
                            <span className="text-xs sm:text-sm bg-grey-fill/50 border border-grey-outline shadow-sm rounded-full px-2 sm:px-3 py-0.5 sm:py-1 ml-auto flex-shrink-0">
                              {folder.documents.length} <span className="hidden sm:inline">files</span>
                            </span>
                          </button>
                          <AnimatePresence>
                            {expandedFolders[property.id]?.includes(
                              folder.id
                            ) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="ml-4 sm:ml-10 mt-2 space-y-2"
                              >
                                {folder.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 bg-grey-fill/50 border border-grey-outline rounded-lg"
                                  >
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                      <div className="flex-shrink-0">
                                        {getFileIcon(doc.file_type)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm sm:text-base truncate">
                                          {doc.name}
                                        </p>
                                        <p className="text-xs sm:text-sm text-primary-grey flex items-center gap-1 sm:gap-2">
                                          <span className="truncate">
                                            {new Date(
                                              doc.created_at
                                            ).toLocaleDateString("en-GB")}
                                          </span>
                                          <span className="w-1 h-1 bg-primary-grey rounded-full flex-shrink-0"></span>
                                          <span className="flex-shrink-0">
                                            {formatFileSize(
                                              doc.size || doc.file_size
                                            )}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDownloadDocument(doc)
                                      }
                                      className="p-1.5 sm:p-2 bg-white border border-grey-outline rounded-lg shadow-sm flex-shrink-0 hover:bg-grey-fill transition-colors"
                                    >
                                      <ArrowDownToLine className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-sm sm:text-base text-gray-500">No documents found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
