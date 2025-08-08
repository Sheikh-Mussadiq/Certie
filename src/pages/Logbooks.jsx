import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// import CustomSelect from "../components/ui/CustomSelect";
import {
  getLogbooks,
  activateLogbook,
  deactivateLogbook,
} from "../services/logbookservices";
import { getPropertiesBasic } from "../services/propertiesServices";
import LogbookEntriesView from "../components/properties/LogbookEntriesView";
import LogbookGrid from "../components/logbooks/LogbookGrid";
import LogbookPageHeader from "../components/logbooks/LogbookPageHeader";
import PropertyGrid from "../components/logbooks/PropertyGrid";
import { useNavigate, useParams } from "react-router-dom";

const Logbooks = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    () => propertyId || ""
  );
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  const handleBackToProperties = () => {
    setSelectedPropertyId("");
    setLogbooks([]);
    setSearchTerm("");
    setActiveTab("Active");
    navigate("/logbooks", { replace: true });
  };

  useEffect(() => {
    let isMounted = true;
    getPropertiesBasic()
      .then((data) => {
        if (!isMounted) return;
        setProperties(data || []);
      })
      .catch(() => setProperties([]));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPropertyId) return;
    setLoading(true);
    setError(null);
    if (String(propertyId) !== String(selectedPropertyId)) {
      navigate(`/logbooks/${selectedPropertyId}`, { replace: true });
    }
    getLogbooks(selectedPropertyId)
      .then((data) => setLogbooks(data || []))
      .catch(() => setError("Failed to fetch logbooks"))
      .finally(() => setLoading(false));
  }, [selectedPropertyId]);

  const selectedProperty = useMemo(
    () => properties.find((p) => String(p.id) === String(selectedPropertyId)),
    [properties, selectedPropertyId]
  );

  const propertyOptions = useMemo(
    () =>
      (properties || []).map((p) => ({
        value: String(p.id),
        label: p.name || `Property ${p.id}`,
      })),
    [properties]
  );

  const canManage = useMemo(() => {
    if (!selectedProperty || !currentUser) return false;
    return selectedProperty.owner_id === currentUser.id;
  }, [selectedProperty, currentUser]);

  const mappedLogbooks = useMemo(
    () =>
      (logbooks || []).map((lb) => ({
        id: lb.id,
        name: lb.logbook_type,
        frequency: lb.frequency,
        description: lb.description,
        isActive: lb.active,
      })),
    [logbooks]
  );

  const headerStats = useMemo(() => {
    const total = mappedLogbooks.length;
    const active = mappedLogbooks.filter((l) => l.isActive).length;
    return { total, active, inactive: total - active };
  }, [mappedLogbooks]);

  const filteredLogbooks = useMemo(() => {
    return mappedLogbooks.filter(
      (logbook) =>
        logbook.isActive === (activeTab === "Active") &&
        (logbook.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          logbook.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [mappedLogbooks, activeTab, searchTerm]);

  const handleToggleActive = async (logbook) => {
    if (!canManage) return;
    setToggleLoadingId(logbook.id);
    try {
      if (logbook.isActive) {
        await deactivateLogbook(logbook.id);
      } else {
        await activateLogbook(logbook.id);
      }
      setLogbooks((prev) =>
        prev.map((lb) =>
          lb.id === logbook.id ? { ...lb, active: !lb.active } : lb
        )
      );
    } catch (e) {
      setError("Failed to update logbook status");
    } finally {
      setToggleLoadingId(null);
    }
  };

  if (selectedLogbook) {
    return (
      <LogbookEntriesView
        logbook={selectedLogbook}
        onBack={() => setSelectedLogbook(null)}
      />
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-xl border border-grey-outline overflow-hidden p-6">
      {selectedPropertyId ? (
        <LogbookPageHeader
          property={selectedProperty}
          stats={headerStats}
          rightSlot={
            <button
              type="button"
              onClick={handleBackToProperties}
              className="inline-flex items-center gap-2 px-4 py-2 bg-grey-fill text-primary-black border border-grey-outline rounded-lg hover:bg-grey-fill/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All properties</span>
            </button>
          }
          onOpenProperty={() => navigate(`/properties/${selectedPropertyId}`)}
        />
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-primary-black">
              Logbooks
            </h1>
            <p className="text-sm text-primary-grey">
              Select a property to view its logbooks.
            </p>
          </div>
        </div>
      )}

      {selectedPropertyId && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex bg-gray-100 rounded-lg w-fit p-1">
            {["Active", "In Active"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
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

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search logbooks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>
        </div>
      )}

      {!selectedPropertyId ? (
        loading ? (
          <div className="text-center py-12 text-primary-grey">
            Loading properties...
          </div>
        ) : (
          <PropertyGrid
            properties={properties}
            onSelect={(p) => setSelectedPropertyId(String(p.id))}
          />
        )
      ) : loading ? (
        <div className="text-center py-12 text-primary-grey">
          Loading logbooks...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : filteredLogbooks.length === 0 ? (
        <div className="text-center py-12 text-primary-grey">
          No logbooks found.
        </div>
      ) : (
        <LogbookGrid
          logbooks={filteredLogbooks}
          canManage={canManage}
          toggleLoadingId={toggleLoadingId}
          onToggleActive={handleToggleActive}
          onOpen={(lb) => setSelectedLogbook(lb)}
        />
      )}
    </div>
  );
};

export default Logbooks;
