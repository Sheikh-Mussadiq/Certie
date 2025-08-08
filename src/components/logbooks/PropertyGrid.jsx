import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const formatAddress = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address;
  const parts = [address.street, address.city, address.postcode].filter(
    Boolean
  );
  return parts.join(", ");
};

const PropertyCard = ({ property, index, onClick }) => {
  const initialLetter = (property?.name || "P").charAt(0).toUpperCase();
  return (
    <motion.button
      type="button"
      onClick={() => onClick(property)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="text-left bg-white rounded-xl border border-grey-outline shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-orange/20"
    >
      <div className="p-4 flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-grey-fill flex items-center justify-center border border-grey-outline">
          {property?.image ? (
            <img
              src={property.image}
              alt={property.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
          ) : (
            <span className="w-6 h-6 rounded bg-primary-orange/10 text-primary-orange text-xs flex items-center justify-center font-semibold">
              {initialLetter}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-primary-black truncate">
            {property?.name || "Untitled Property"}
          </h3>
          <p className="text-sm text-primary-grey truncate">
            {formatAddress(property?.address)}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

const PropertyGrid = ({ properties, onSelect }) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12 text-primary-grey">
        No properties found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <PropertyCard
          key={property.id}
          property={property}
          index={index}
          onClick={onSelect}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
