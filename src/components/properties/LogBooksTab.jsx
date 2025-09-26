import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import {
  getLogbooks,
  activateLogbook,
  deactivateLogbook,
  createLogbook,
  deleteLogbook,
  updateLogbook,
} from "../../services/logbookservices";
import LogbookEntriesView from "./LogbookEntriesView";
import { useOutletContext, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogBookModal from "./LogBookModal";
import DeleteLogBookModal from "./DeleteLogBookModal";
import { toast } from "react-hot-toast";
import LogbookGridShimmer from "../logbooks/shimmers/LogbookGridShimmer";

const LogBooksTab = () => {
  const { currentUser } = useAuth();
  const { property } = useOutletContext();
  const { logbookId } = useParams();
  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [form, setForm] = useState({
    logbook_type: "",
    description: "",
    frequency: "Monthly",
  });
  const [selectedLogbook, setSelectedLogbook] = useState(null); // For viewing entries
  const [editingLogbook, setEditingLogbook] = useState(null); // For editing metadata
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logbookToDelete, setLogbookToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const frequencyOptions = [
    "Daily",
    "Weekly",
    "Monthly",
    "Quarterly",
    "Annually",
    "Every 6 months",
    "Every 2 years",
    "Every 3 years",
    "Every 5 years",
  ];

  useEffect(() => {
    const fetchLogbooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLogbooks(property.id);
        setLogbooks(data || []);
      } catch (err) {
        setError("Failed to fetch logbooks");
      } finally {
        setLoading(false);
      }
    };
    fetchLogbooks();
  }, []);

  const handleToggleActive = async (logbook) => {
    setToggleLoadingId(logbook.id);
    try {
      if (logbook.isActive) {
        await deactivateLogbook(logbook.id);
      } else {
        await activateLogbook(logbook.id);
      }
      // Update local state instead of refetching
      setLogbooks((prevLogbooks) =>
        prevLogbooks.map((lb) =>
          lb.id === logbook.id ? { ...lb, active: !lb.active } : lb
        )
      );
    } catch (err) {
      setError("Failed to update logbook status");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleModalChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateLogbook = async (formData) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const newLogbook = await createLogbook({
        ...formData,
        property_id: property.id,
      });
      setShowModal(false);
      // Add new logbook to local state instead of refetching
      if (newLogbook) {
        setLogbooks((prevLogbooks) => [...prevLogbooks, newLogbook]);
      }
      toast.success("Logbook created successfully");
    } catch (err) {
      setModalError("Failed to create logbook");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditLogbook = async (formData) => {
    if (!editingLogbook) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const updated = await updateLogbook(editingLogbook.id, formData);
      if (updated) {
        setLogbooks((prev) =>
          prev.map((lb) => (lb.id === updated.id ? updated : lb))
        );
      }
      toast.success("Logbook updated");
      setShowModal(false);
      setEditingLogbook(null);
    } catch (err) {
      setModalError("Failed to update logbook");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (logbook, e) => {
    e.stopPropagation();
    setLogbookToDelete(logbook);
    setShowDeleteModal(true);
  };

  const handleDeleteLogbook = async () => {
    if (!logbookToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteLogbook(logbookToDelete.id);
      // Remove from local state
      setLogbooks((prevLogbooks) =>
        prevLogbooks.filter((lb) => lb.id !== logbookToDelete.id)
      );
      setShowDeleteModal(false);
      setLogbookToDelete(null);
    } catch (err) {
      setError("Failed to delete logbook");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Function to extract initials from logbook name
  const getLogbookInitials = (name) => {
    if (!name) return "LB";

    // Clean the name by removing any brackets and their contents
    const cleanName = name
      .replace(/\s*\([^)]*\)\s*$/, "")
      .replace(/\s*\)\s*$/, "")
      .trim();

    // Split by spaces to get words
    const words = cleanName.split(/\s+/);

    if (words.length === 1) {
      // For single word, take first and last letter if possible
      const word = words[0];
      if (word.length >= 2) {
        return (word.charAt(0) + word.charAt(word.length - 1)).toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.charAt(0).toUpperCase();
    } else {
      // For multiple words, take first letter of first and last word
      return (
        words[0].charAt(0) + words[words.length - 1].charAt(0)
      ).toUpperCase();
    }
  };

  // Function to generate a color based on the logbook name
  const getLogbookColor = (name) => {
    if (!name) return "#4F46E5"; // Default color

    // List of colors to choose from
    const colors = [
      "#4F46E5", // Indigo
      "#0EA5E9", // Sky blue
      "#10B981", // Emerald
      "#6366F1", // Violet
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#F43F5E", // Rose
      "#F59E0B", // Amber
      "#84CC16", // Lime
      "#14B8A6", // Teal
    ];

    // Use the sum of character codes as a consistent hash
    const hash = name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    // Use the hash to pick a color
    return colors[hash % colors.length];
  };

  // Auto-select logbook if logbookId is provided in URL
  useEffect(() => {
    if (logbookId && logbooks.length > 0) {
      const logbook = logbooks.find(lb => lb.id === logbookId);
      if (logbook) {
        // Map the logbook data to the expected format
        const mappedLogbook = {
          id: logbook.id,
          name: logbook.logbook_type,
          initials: getLogbookInitials(logbook.logbook_type),
          color: getLogbookColor(logbook.logbook_type),
          frequency: logbook.frequency,
          regulation: logbook.regulation || "",
          description: logbook.description,
          isActive: logbook.active,
        };
        setSelectedLogbook(mappedLogbook);
      }
    }
  }, [logbookId, logbooks]);

  // Map Supabase data to UI shape (add icon, regulation, isActive, etc. as needed)
  const mappedLogbooks = logbooks.map((logbook) => {
    const name = logbook.logbook_type;
    return {
      id: logbook.id,
      name,
      initials: getLogbookInitials(name),
      color: getLogbookColor(name),
      frequency: logbook.frequency,
      regulation: logbook.regulation || "", // Add if exists in table
      description: logbook.description,
      isActive: logbook.active,
    };
  });

  const filteredLogbooks = mappedLogbooks.filter(
    (logbook) =>
      logbook.isActive === (activeTab === "Active") &&
      (logbook.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logbook.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (selectedLogbook) {
    return (
      <LogbookEntriesView
        logbook={selectedLogbook}
        property={property}
        onBack={() => setSelectedLogbook(null)}
      />
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-xl border border-grey-outline overflow-hidden p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-primary-black">LogBooks</h2>
          <p className="text-sm text-primary-grey">
            Easily manage, track, and organize all your property logbooks in one
            place.
          </p>
        </div>
  {currentUser.id === property.owner_id && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-secondary-black text-white rounded-xl hover:bg-secondary-black/90 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" />
            Create Custom LogBook
          </button>
        )}
      </div>

      <div className="flex mb-4 bg-gray-100  rounded-lg w-fit">
        {["Active", "In Active"].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-white text-secondary-black border border-grey-outline"
                : "text-primary-grey hover:text-secondary-black"
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      <div className="relative w-1/2">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 px-4 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
        />
      </div>
      {loading ? (
        <LogbookGridShimmer />
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogbooks.map((logbook) => (
            <div
              key={logbook.id}
              className="bg-white rounded-xl border border-grey-outline transition-colors cursor-pointer shadow-sm"
              onClick={(e) => {
                // Prevent opening modal when toggling active
                if (e.target.type !== "checkbox") setSelectedLogbook(logbook);
              }}
            >
              <div className="flex flex-col items-start justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: logbook.color + "20" }} // Add 20 for 12.5% opacity
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-md text-white font-medium"
                      style={{ backgroundColor: logbook.color }}
                    >
                      {logbook.initials}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-black">
                      {logbook.name}
                    </h3>
                    <p className="text-sm text-primary-grey">
                      {logbook.frequency}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-primary-grey mb-4">
                    {logbook.regulation}
                  </p>
                  <p className="text-sm text-primary-grey mb-4">
                    {logbook.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 bg-grey-fill p-4 rounded-b-xl">
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm bg-white border border-grey-outline shadow-sm text-primary-black transition-colors px-4 py-2 rounded-lg"
                    type="button"
                  >
                    View detail
                  </button>
                  {currentUser.id === property.owner_id && (
                    <button
                      onClick={(e) => handleDeleteClick(logbook, e)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete logbook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {currentUser.id === property.owner_id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLogbook(logbook);
                        setShowModal(true);
                      }}
                      className="p-2 text-primary-black hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit logbook"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                  {currentUser.id === property.owner_id && (
                <label
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={logbook.isActive}
                    onChange={() => handleToggleActive(logbook)}
                    disabled={toggleLoadingId === logbook.id}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-black ${
                      toggleLoadingId === logbook.id ? "opacity-50" : ""
                    }`}
                  ></div>
                </label>
                  )}
              </div>
            </div>
          ))}

          {activeTab === "Active" && currentUser.id === property.owner_id && (
            <div 
              className="border-2 border-dashed border-grey-outline rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-black hover:bg-grey-fill/30 transition-all duration-200"
              onClick={() => setShowModal(true)}
            >
              <div className="w-12 h-12 rounded-lg bg-grey-fill flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-primary-grey" />
              </div>
              <h3 className="font-medium text-primary-black mb-1">
                Create Custom LogBook
              </h3>
              <p className="text-sm text-primary-grey mb-4">
                Add a New logbook tailored to your specific needs
              </p>
            </div>
          )}
        </div>
      )}

      <LogBookModal
        isOpen={showModal}
        closeModal={() => {
          setShowModal(false);
          setEditingLogbook(null);
        }}
        onSubmit={editingLogbook ? handleEditLogbook : handleCreateLogbook}
        loading={modalLoading}
        error={modalError}
        frequencyOptions={frequencyOptions}
        initialData={editingLogbook}
        mode={editingLogbook ? "edit" : "create"}
      />

      {/* Delete LogBook Modal */}
      <DeleteLogBookModal
        isOpen={showDeleteModal}
        closeModal={() => {
          setShowDeleteModal(false);
          setLogbookToDelete(null);
        }}
        logbookToDelete={logbookToDelete}
        onConfirm={handleDeleteLogbook}
        loading={deleteLoading}
      />
    </div>
  );
};

export default LogBooksTab;
