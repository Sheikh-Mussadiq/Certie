import { motion } from "framer-motion";

const PropertyListView = ({
  properties,
  selectedProperties,
  onSelectProperty,
}) => {
  return (
    <div className="divide-y divide-grey-outline">
      {properties.map((property) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 hover:bg-grey-fill/50 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              className="rounded border-grey-outline text-primary-orange focus:ring-primary-orange"
              checked={selectedProperties.includes(property.id)}
              onChange={(e) => {
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
                {property.address}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-primary-grey mb-1">
                    Compliance Score
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${property.complianceScore}%` }}
                      />
                    </div>
                    <span className="text-sm text-primary-black">
                      {property.complianceScore}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-primary-grey mb-1">
                    Training Score
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${property.trainingScore}%` }}
                      />
                    </div>
                    <span className="text-sm text-primary-black">
                      {property.trainingScore}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-primary-grey mb-1">
                    Contact Number
                  </p>
                  <p className="text-sm text-primary-black">
                    {property.contactNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-grey mb-1">
                    Responsible Person
                  </p>
                  <p className="text-sm text-primary-black">
                    {property.responsiblePerson}
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
