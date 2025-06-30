import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  getLogbooks,
  activateLogbook,
  deactivateLogbook,
  createLogbook,
} from "../../services/logbookservices";
import LogbookEntriesView from "./LogbookEntriesView";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LogBooksTab = () => {
  const { currentUser } = useAuth();
  const { property } = useOutletContext();
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
  const [selectedLogbook, setSelectedLogbook] = useState(null);

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
        const data = await getLogbooks();
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
      // Refresh logbooks after update
      const data = await getLogbooks();
      setLogbooks(data || []);
    } catch (err) {
      setError("Failed to update logbook status");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleModalChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateLogbook = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      await createLogbook(form);
      setShowModal(false);
      setForm({ logbook_type: "", description: "", frequency: "Monthly" });
      // Refresh logbooks
      const data = await getLogbooks();
      setLogbooks(data || []);
    } catch (err) {
      setModalError("Failed to create logbook");
    } finally {
      setModalLoading(false);
    }
  };

  // Map Supabase data to UI shape (add icon, regulation, isActive, etc. as needed)
  const mappedLogbooks = logbooks.map((logbook) => ({
    id: logbook.id,
    icon: "/src/assets/icons/zapier.png", // Placeholder, update as needed
    name: logbook.logbook_type,
    frequency: logbook.frequency,
    regulation: logbook.regulation || "", // Add if exists in table
    description: logbook.description,
    isActive: logbook.active,
  }));

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
            Streamline work, save your time and growth easier
          </p>
        </div>
        {currentUser.id === property.owner_id && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary-black text-white rounded-lg hover:bg-primary-black/90 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" />
            Create Custom LogBook
          </button>
        )}
      </div>

      <div className="flex mb-4 bg-gray-100 p-0.5 rounded-md w-fit">
        {["Active", "In Active"].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-primary-black shadow-sm border border-grey-outline"
                : "text-primary-grey hover:text-primary-black"
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Loading logbooks...</div>
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
                  <div className="w-12 h-12 rounded-lg bg-grey-fill flex items-center justify-center">
                    <img
                      src={logbook.icon}
                      alt={logbook.name}
                      className="w-6 h-6"
                    />
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
                <button
                  className="text-sm bg-white border border-grey-outline shadow-sm text-primary-black transition-colors px-4 py-2 rounded-lg"
                  type="button"
                >
                  View detail
                </button>
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
              </div>
            </div>
          ))}

          {activeTab === "Active" && (
            <div className="border-2 border-dashed border-grey-outline rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-lg bg-grey-fill flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-primary-grey" />
              </div>
              <h3 className="font-medium text-primary-black mb-1">
                Create Custom LogBook
              </h3>
              <p className="text-sm text-primary-grey mb-4">
                Add a New logbook tailored to your specific
              </p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">
              Create Custom LogBook
            </h2>
            <form onSubmit={handleCreateLogbook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="logbook_type"
                  value={form.logbook_type}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={form.frequency}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                  required
                >
                  {frequencyOptions.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
              {modalError && (
                <div className="text-red-500 text-sm">{modalError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-primary-black text-white py-2 rounded-lg hover:bg-primary-black/90 transition-colors"
                disabled={modalLoading}
              >
                {modalLoading ? "Creating..." : "Create LogBook"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogBooksTab;
