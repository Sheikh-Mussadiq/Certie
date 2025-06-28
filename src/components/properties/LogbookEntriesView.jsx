import { useEffect, useState } from "react";
import { getLogbookEntries, createLogbookEntry } from "../../services/logbookservices";

const COMPLETION_STATUS_OPTIONS = [
  "Working Correctly",
  "Issue Identified",
];

function addFrequencyToDate(date, frequency) {
  const d = new Date(date);
  switch (frequency) {
    case 'Daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'Weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'Monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'Quarterly':
      d.setMonth(d.getMonth() + 3);
      break;
    case 'Annually':
      d.setFullYear(d.getFullYear() + 1);
      break;
    case 'Every 6 months':
      d.setMonth(d.getMonth() + 6);
      break;
    case 'Every 2 years':
      d.setFullYear(d.getFullYear() + 2);
      break;
    case 'Every 3 years':
      d.setFullYear(d.getFullYear() + 3);
      break;
    case 'Every 5 years':
      d.setFullYear(d.getFullYear() + 5);
      break;
    default:
      return 'Unknown';
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
        issue_comment: form.completion_status === "Issue Identified" ? form.issue_comment : undefined,
        performed_by: form.performed_by,
      });
      setShowModal(false);
      setForm({ completion_status: "Working Correctly", issue_comment: "", performed_by: "" });
      await refreshEntries();
    } catch {
      setModalError("Failed to add entry");
    } finally {
      setModalLoading(false);
    }
  };

  if (!logbook) return null;

  let nextDue = 'No entries yet';
  if (entries.length > 0) {
    const lastPerformed = entries[0].performed_at;
    nextDue = addFrequencyToDate(lastPerformed, logbook.frequency);
  }

  return (
    <div className="space-y-6 bg-white rounded-xl border border-grey-outline overflow-hidden p-4">
      <button
        className="mb-4 px-4 py-2 bg-primary-black text-white rounded-lg hover:bg-primary-black/90 transition-colors"
        onClick={onBack}
      >
        &larr; Back to Logbooks
      </button>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-primary-black">
          Logbook Entries: {logbook.name || logbook.logbook_type}
        </h2>
        <button
          className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors"
          onClick={() => setShowModal(true)}
        >
          + Add Entry
        </button>
      </div>
      <div className="mb-4 text-primary-grey text-sm">
        <span className="font-semibold text-primary-black">Next Due: </span>{nextDue}
      </div>
      {loading ? (
        <div className="text-center py-8">Loading entries...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 text-primary-grey">No entries found for this logbook.</div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {entries.map((entry) => (
            <div key={entry.id} className="border rounded-lg p-4 bg-grey-fill">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-primary-black">{entry.performed_by}</span>
                <span className="text-xs text-primary-grey">{entry.performed_at ? new Date(entry.performed_at).toLocaleDateString() : "-"}</span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold">Status: </span>
                <span className="text-sm">{entry.completion_status}</span>
              </div>
              {entry.issue_comment && (
                <div className="text-sm text-primary-grey mt-1">{entry.issue_comment}</div>
              )}
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">Add Logbook Entry</h2>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Completion Status</label>
                <select
                  name="completion_status"
                  value={form.completion_status}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                  required
                >
                  {COMPLETION_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              {form.completion_status === "Issue Identified" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Issue Comment</label>
                  <textarea
                    name="issue_comment"
                    value={form.issue_comment}
                    onChange={handleModalChange}
                    className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Performed By</label>
                <input
                  type="text"
                  name="performed_by"
                  value={form.performed_by}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                  required
                />
              </div>
              {/* performed_at is auto-set to today */}
              {modalError && <div className="text-red-500 text-sm">{modalError}</div>}
              <button
                type="submit"
                className="w-full bg-primary-black text-white py-2 rounded-lg hover:bg-primary-black/90 transition-colors"
                disabled={modalLoading}
              >
                {modalLoading ? "Adding..." : "Add Entry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogbookEntriesView; 