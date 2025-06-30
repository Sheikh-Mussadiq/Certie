import { useEffect, useState } from "react";
import {
  getLogbookEntries,
  createLogbookEntry,
} from "../../services/logbookservices";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Calendar,
  CheckCircle,
  AlertTriangle,
  User,
  Clock,
  X,
  Loader2,
  ClipboardList,
  SortAsc,
  Filter,
  MessageSquare,
} from "lucide-react";
import Shimmer from "../ui/Shimmer";

const COMPLETION_STATUS_OPTIONS = ["Working Correctly", "Issue Identified"];

function addFrequencyToDate(date, frequency) {
  const d = new Date(date);
  switch (frequency) {
    case "Daily":
      d.setDate(d.getDate() + 1);
      break;
    case "Weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "Monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "Quarterly":
      d.setMonth(d.getMonth() + 3);
      break;
    case "Annually":
      d.setFullYear(d.getFullYear() + 1);
      break;
    case "Every 6 months":
      d.setMonth(d.getMonth() + 6);
      break;
    case "Every 2 years":
      d.setFullYear(d.getFullYear() + 2);
      break;
    case "Every 3 years":
      d.setFullYear(d.getFullYear() + 3);
      break;
    case "Every 5 years":
      d.setFullYear(d.getFullYear() + 5);
      break;
    default:
      return "Unknown";
  }
  return d.toLocaleDateString();
}

const LogbookEntriesView = ({ logbook, onBack }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [form, setForm] = useState({
    completion_status: "Working Correctly",
    issue_comment: "",
    performed_by: "",
  });
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    if (!logbook) return;
    setLoading(true);
    setError(null);
    getLogbookEntries(logbook.id)
      .then((data) => setEntries(data || []))
      .catch(() => setError("Failed to fetch entries"))
      .finally(() => setLoading(false));
  }, [logbook]);

  const refreshEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLogbookEntries(logbook.id);
      setEntries(data || []);
    } catch {
      setError("Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  const handleModalChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      await createLogbookEntry({
        logbook_id: logbook.id,
        completion_status: form.completion_status,
        issue_comment:
          form.completion_status === "Issue Identified"
            ? form.issue_comment
            : undefined,
        performed_by: form.performed_by,
      });
      setShowModal(false);
      setForm({
        completion_status: "Working Correctly",
        issue_comment: "",
        performed_by: "",
      });
      await refreshEntries();
    } catch {
      setModalError("Failed to add entry");
    } finally {
      setModalLoading(false);
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  if (!logbook) return null;

  let nextDue = "No entries yet";
  if (entries.length > 0) {
    const lastPerformed = entries[0].performed_at;
    nextDue = addFrequencyToDate(lastPerformed, logbook.frequency);
  }

  // Shimmer rows for loading state
  const shimmerRows = Array(4).fill(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-white rounded-xl border border-grey-outline overflow-hidden p-6 shadow-sm"
    >
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 bg-grey-fill text-primary-black rounded-lg hover:bg-grey-fill/80 transition-all"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Logbooks</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-black text-white rounded-lg hover:bg-primary-black/90 transition-all"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Entry</span>
        </motion.button>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-primary-black flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary-orange" />
          {logbook.name || logbook.logbook_type}
        </h2>
        <div className="flex items-center gap-2 mt-2 text-primary-grey">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{logbook.frequency}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 bg-grey-fill p-3 rounded-lg">
          <Calendar className="w-5 h-5 text-primary-orange" />
          <div>
            <span className="text-xs text-primary-grey">Next Due</span>
            <p className="font-medium text-primary-black">{nextDue}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-6">
          {/* <div className="flex justify-between items-center mb-4">
            <Shimmer className="h-5 w-24 rounded-xl" />
            <div className="flex gap-2">
              <Shimmer className="h-8 w-20 rounded-xl" />
              <Shimmer className="h-8 w-20 rounded-xl" />
            </div>
          </div> */}

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2 table-fixed">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">
                    <Shimmer className="h-4 w-16 rounded-xl" />
                  </th>
                  <th className="px-4 py-2 text-left">
                    <Shimmer className="h-4 w-24 rounded-xl" />
                  </th>
                  <th className="px-4 py-2 text-left">
                    <Shimmer className="h-4 w-20 rounded-xl" />
                  </th>
                  <th className="px-4 py-2 text-left">
                    <Shimmer className="h-4 w-16 rounded-xl" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {shimmerRows.map((_, index) => (
                  <tr key={`shimmer-${index}`}>
                    <td className="px-4 py-3 rounded-l-lg border-l border-t border-b border-grey-outline">
                      <div className="flex items-center gap-2">
                        <Shimmer className="h-10 w-full rounded-xl" />
                      </div>
                    </td>
                    <td className="px-4 py-3 border-t border-b border-grey-outline">
                      <Shimmer className="h-10 w-full rounded-xl" />
                    </td>
                    <td className="px-4 py-3 border-t border-b border-grey-outline">
                      <Shimmer className="h-10 w-full rounded-xl" />
                    </td>
                    <td className="px-4 py-3 rounded-r-lg border-t border-b border-r border-grey-outline">
                      <Shimmer className="h-10 w-full rounded-xl" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-red-500">
          <AlertTriangle className="w-8 h-8 mb-2" />
          <p>{error}</p>
        </div>
      ) : entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-primary-grey"
        >
          <ClipboardList className="w-12 h-12 mb-3 text-grey-outline" />
          <p className="text-center">No entries found for this logbook.</p>
          <p className="text-center text-sm">
            Add your first entry to get started.
          </p>
        </motion.div>
      ) : (
        <div className="mt-6">
          {/* <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-primary-grey">
              Entry History
            </h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-xs text-primary-grey bg-grey-fill hover:bg-grey-fill/80 px-3 py-1.5 rounded-md transition-colors">
                <Filter className="w-3 h-3" />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-1 text-xs text-primary-grey bg-grey-fill hover:bg-grey-fill/80 px-3 py-1.5 rounded-md transition-colors">
                <SortAsc className="w-3 h-3" />
                <span>Sort</span>
              </button>
            </div>
          </div> */}

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-separate border-spacing-y-2 table-fixed">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-primary-grey w-[120px]">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-primary-grey w-[30%]">
                    Performed By
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-primary-grey w-[25%]">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-primary-grey w-[15%]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-outline/30">
                <AnimatePresence>
                  {entries.map((entry, index) => (
                    <>
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`bg-white hover:bg-grey-fill/30 transition-colors cursor-pointer ${
                          expandedRowId === entry.id ? "bg-grey-fill/30" : ""
                        }`}
                        onClick={() => toggleRowExpand(entry.id)}
                      >
                        <td className="px-4 py-3 text-sm rounded-l-lg border-l border-t border-b border-grey-outline">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-grey flex-shrink-0" />
                            <span>
                              {entry.performed_at
                                ? new Date(
                                    entry.performed_at
                                  ).toLocaleDateString()
                                : "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm border-t border-b border-grey-outline">
                          <div className="flex items-center gap-2 max-w-full">
                            <User className="w-4 h-4 text-primary-grey flex-shrink-0" />
                            <span
                              className="font-medium truncate"
                              title={entry.performed_by}
                            >
                              {entry.performed_by}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm border-t border-b border-grey-outline">
                          <div className="flex items-center gap-2">
                            {entry.completion_status === "Working Correctly" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  Working Correctly
                                </span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs">
                                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  Issue Identified
                                </span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm rounded-r-lg border-t border-b border-r border-grey-outline">
                          {entry.issue_comment ? (
                            <span className="inline-flex items-center gap-1 text-primary-orange hover:text-primary-orange/80">
                              <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">View details</span>
                            </span>
                          ) : (
                            <span className="text-primary-grey truncate">
                              No issues
                            </span>
                          )}
                        </td>
                      </motion.tr>

                      {/* Expandable row for issue comments */}
                      {expandedRowId === entry.id && entry.issue_comment && (
                        <motion.tr
                          key={`${entry.id}-expanded`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={4} className="px-0 py-0">
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mx-4 mb-4 overflow-hidden"
                            >
                              <div className="bg-grey-fill p-4 rounded-lg text-sm border border-grey-outline/50">
                                <h4 className="font-medium text-primary-black mb-2 flex items-center gap-1.5">
                                  <MessageSquare className="w-4 h-4 text-primary-orange flex-shrink-0" />
                                  Issue Details
                                </h4>
                                <div className="text-primary-grey whitespace-pre-wrap break-words overflow-x-hidden">
                                  {entry.issue_comment}
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </motion.tr>
                      )}
                    </>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {entries.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-xs text-primary-grey">
              <span>Showing {entries.length} entries</span>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-primary-black">
                  Add Logbook Entry
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-primary-grey hover:text-primary-black rounded-full p-1"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Completion Status
                  </label>
                  <div className="relative">
                    <select
                      name="completion_status"
                      value={form.completion_status}
                      onChange={handleModalChange}
                      className="w-full px-4 py-3 border border-grey-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange appearance-none bg-white pr-10 transition-all"
                      required
                    >
                      {COMPLETION_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-primary-grey"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {form.completion_status === "Issue Identified" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-primary-black">
                        Issue Description
                      </label>
                      <textarea
                        name="issue_comment"
                        value={form.issue_comment}
                        onChange={handleModalChange}
                        className="w-full px-4 py-3 border border-grey-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange resize-none min-h-[100px]"
                        placeholder="Describe the issue..."
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Performed By
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="performed_by"
                      value={form.performed_by}
                      onChange={handleModalChange}
                      className="w-full px-4 py-3 pl-10 border border-grey-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange"
                      placeholder="Enter your name"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="w-5 h-5 text-primary-grey" />
                    </div>
                  </div>
                </div>

                {modalError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-md"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {modalError}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary-black text-white py-3 rounded-lg hover:bg-primary-black/90 transition-all flex items-center justify-center gap-2"
                  disabled={modalLoading}
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Entry</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </motion.div>
  );
};

export default LogbookEntriesView;
