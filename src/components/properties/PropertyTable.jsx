import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PropertyTable = ({
  properties,
  selectedProperties,
  onSelectProperty,
}) => {
  const navigate = useNavigate();
  return (
    <table className="w-full border-collapse">
      <thead className="bg-grey-fill">
        <tr>
          <th className="px-6 py-4 text-left border-r border-grey-outline">
            <input
              type="checkbox"
              className="rounded border-grey-outline text-primary-orange focus:ring-primary-orange"
              checked={selectedProperties.length === properties.length}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelectProperty(properties.map((p) => p.id));
                } else {
                  onSelectProperty([]);
                }
              }}
            />
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black border-r border-grey-outline">
            Property Name
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black border-r border-grey-outline">
            Address
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black border-r border-grey-outline">
            Compliance Score
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black border-r border-grey-outline">
            Property Type
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">
            Manager
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-grey-outline">
        {properties.map((property) => (
          <motion.tr
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="hover:bg-grey-fill/50 cursor-pointer"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            <td className="px-6 py-4 border-r border-grey-outline" onClick={(e) => e.stopPropagation()}>
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
            </td>
            <td className="px-6 py-4 border-r border-grey-outline">
              <div className="text-sm text-primary-black">
                {property.name}
              </div>
            </td>
            <td className="px-6 py-4 border-r border-grey-outline">
              <div className="text-sm text-primary-black">
                {property.address ? (
                  typeof property.address === 'string' ? property.address : 
                  `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.postcode || ''}`
                ) : 'N/A'}
              </div>
            </td>
            <td className="px-6 py-4 border-r border-grey-outline">
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
            </td>
            <td className="px-6 py-4 border-r border-grey-outline">
              <div className="text-sm text-primary-black">
                {property.property_type || 'N/A'}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-primary-black">
                {property.manager || 'N/A'}
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
};

export default PropertyTable;
