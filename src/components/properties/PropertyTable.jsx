import { motion } from "framer-motion"
import { useState } from "react"

const PropertyTable = ({ properties, selectedProperties, onSelectProperty }) => {
  return (
    <table className="w-full">
      <thead className="bg-grey-fill">
        <tr>
          <th className="px-6 py-4 text-left">
            <input
              type="checkbox"
              className="rounded border-grey-outline text-primary-orange focus:ring-primary-orange"
              checked={selectedProperties.length === properties.length}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelectProperty(properties.map(p => p.id))
                } else {
                  onSelectProperty([])
                }
              }}
            />
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Address</th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Compliance Score</th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Training Score</th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Contact Number</th>
          <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Responsible Person</th>
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
          >
            <td className="px-6 py-4">
              <input
                type="checkbox"
                className="rounded border-grey-outline text-primary-orange focus:ring-primary-orange"
                checked={selectedProperties.includes(property.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelectProperty([...selectedProperties, property.id])
                  } else {
                    onSelectProperty(selectedProperties.filter(id => id !== property.id))
                  }
                }}
              />
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-primary-black">{property.address}</div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${property.complianceScore}%` }}
                  />
                </div>
                <span className="text-sm text-primary-black">{property.complianceScore}%</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${property.trainingScore}%` }}
                  />
                </div>
                <span className="text-sm text-primary-black">{property.trainingScore}%</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-primary-black">{property.contactNumber}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-primary-black">{property.responsiblePerson}</div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  )
}

export default PropertyTable