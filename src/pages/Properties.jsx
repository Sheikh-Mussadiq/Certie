import { motion } from "framer-motion"
import { Download, Upload, Plus } from "lucide-react"

const mockProperties = [
  {
    id: 1,
    address: "1234 Innovation Drive, 94103, United States",
    complianceScore: 85,
    trainingScore: 92,
    contactNumber: "+1 (555) 123-4567",
    responsiblePerson: "John Smith",
  },
  {
    id: 2,
    address: "567 Tech Park Avenue, 94104, United States",
    complianceScore: 78,
    trainingScore: 88,
    contactNumber: "+1 (555) 987-6543",
    responsiblePerson: "Sarah Johnson",
  },
  {
    id: 3,
    address: "890 Enterprise Road, 94105, United States",
    complianceScore: 92,
    trainingScore: 95,
    contactNumber: "+1 (555) 456-7890",
    responsiblePerson: "Michael Brown",
  },
]

const Properties = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-primary-black">Properties</h1>
        <div className="flex gap-3">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-grey-outline rounded-lg text-primary-black hover:bg-grey-fill transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="px-4 py-2 border border-grey-outline rounded-lg text-primary-black hover:bg-grey-fill transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <button className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-grey-outline overflow-hidden">
        <table className="w-full">
          <thead className="bg-grey-fill">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Address</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Compliance Score</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Training Score</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Contact Number</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-primary-black">Responsible Person</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-outline">
            {mockProperties.map((property) => (
              <motion.tr
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-grey-fill/50 cursor-pointer"
              >
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
      </div>
    </div>
  )
}

export default Properties