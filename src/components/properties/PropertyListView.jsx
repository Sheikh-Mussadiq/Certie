import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PropertyListView = ({
  properties,
  selectedProperties,
  onSelectProperty,
}) => {
  const navigate = useNavigate();
  return (
    <div className="divide-y divide-grey-outline">
      {properties.map((property) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 hover:bg-grey-fill/50 cursor-pointer"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              className="rounded border-grey-outline text-primary-orange focus:ring-primary-orange"
              checked={selectedProperties.includes(property.id)}
              onChange={(e) => {
                e.stopPropagation();
                if (e.target.checked) {
                  onSelectProperty([...selectedProperties, property.id]);
                } else {
                  onSelectProperty(
                    selectedProperties.filter((id) => id !== property.id)
                  );
                }
              }}
            />
            <div className="flex-1">
              <h3 className="text-primary-black font-medium mb-2">
                {property.name || 'Unnamed Property'}
              </h3>
              <p className="text-sm text-primary-grey mb-2">
                {property.address ? (
                  typeof property.address === 'string' ? property.address : 
                  `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.postcode || ''}`
                ) : 'No address available'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-primary-grey mb-1">
                    Compliance Score
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${property.compliance_score || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-primary-black">
                      {property.compliance_score || 0}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-primary-grey mb-1">
                    Property Type
                  </p>
                  <p className="text-sm text-primary-black">
                    {property.property_type || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-grey mb-1">
                    Contact Number
                  </p>
                  <p className="text-sm text-primary-black">
                    {property.contact_phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-grey mb-1">
                    Manager
                  </p>
                  <p className="text-sm text-primary-black">
                    {property.manager || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyListView;
