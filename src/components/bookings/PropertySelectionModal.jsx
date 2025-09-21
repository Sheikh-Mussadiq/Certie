import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Building2 } from "lucide-react";
import { getPropertiesBasic } from "../../services/propertiesServices";
import { useAuth } from "../../context/AuthContext";
import Shimmer from "../ui/Shimmer";

const PropertySelectionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getPropertiesBasic();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties
    .filter(property => property.owner_id === currentUser?.id) // Filter by ownership
    .filter(property => 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.address && typeof property.address === 'object' &&
        (property.address.street?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         property.address.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         property.address.postcode?.toLowerCase().includes(searchQuery.toLowerCase())))
    );

  const handleAddPropertyClick = () => {
    onClose();
    navigate("/properties/add");
  };

  const handlePropertySelect = (propertyId) => {
    navigate("/contractor-workflow", {
      state: {
        propertyId: propertyId,
        startAtStep: 2,
      },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-grey-outline flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary-black">Select Property</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddPropertyClick}
              className="px-4 py-2 bg-primary-orange text-white text-sm rounded-lg hover:bg-primary-orange/90 transition-colors"
            >
              Add Property
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full px-4 py-2 border border-grey-outline rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-grey-outline rounded-lg p-4">
                  <Shimmer className="h-6 w-48 mb-2" />
                  <Shimmer className="h-4 w-64" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-primary-grey">
              <div className="w-16 h-16 bg-grey-fill rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-sm text-gray-500 mb-4">You don't have any properties available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="border border-grey-outline rounded-lg p-4 hover:bg-grey-fill/50 cursor-pointer transition-colors"
                  onClick={() => handlePropertySelect(property.id)}
                >
                  <h3 className="font-medium text-primary-black mb-1">
                    {property.name}
                  </h3>
                  <p className="text-sm text-primary-grey">
                    {property.address
                      ? typeof property.address === "string"
                        ? property.address
                        : `${property.address.street || ""}, ${
                            property.address.city || ""
                          }, ${property.address.postcode || ""}`
                      : "No address available"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySelectionModal;
