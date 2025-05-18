import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2 } from 'lucide-react'

const PropertyDetails = ({ property }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'logbooks', label: 'Logbooks' },
    { id: 'documents', label: 'Documents' }
  ]

  const protectionAssets = [
    {
      asset: 'Fire Alarm System',
      lastChecked: '12 Mar - 2025',
      status: 'Completed'
    },
    {
      asset: 'Fire Extinguisher',
      lastChecked: '12 Mar - 2025',
      status: 'Completed'
    },
    {
      asset: '8 Pegier Square, London E3 4PL',
      lastChecked: '12 Mar - 2025',
      status: 'Completed'
    },
    {
      asset: '8 Pegier Square, London E3 4PL',
      lastChecked: '12 Mar - 2025',
      status: 'Completed'
    }
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-primary-black">Property Details</h1>
          <p className="text-sm text-primary-grey">{property?.address?.street}, {property?.address?.city}, {property?.address?.postcode}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-primary-black hover:bg-grey-fill rounded-lg transition-colors">
          <Edit2 className="w-4 h-4" />
          Edit Property
        </button>
      </div>

      <div className="bg-white rounded-xl border border-grey-outline overflow-hidden">
        <div className="border-b border-grey-outline">
          <div className="flex gap-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 relative ${
                  activeTab === tab.id ? 'text-primary-orange' : 'text-primary-grey hover:text-primary-black'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-orange"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4">Property Name</h2>
                <div className="aspect-[21/9] rounded-lg overflow-hidden">
                  {property?.image ? (
                    <img
                      src={URL.createObjectURL(property.image)}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-grey-fill flex items-center justify-center">
                      <span className="text-primary-grey">No image available</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-primary-grey mb-4">Property Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Property Id</span>
                      <span className="text-sm font-medium">01</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Compliance Score</span>
                      <span className="text-sm font-medium">93</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Manager</span>
                      <span className="text-sm font-medium">{property?.manager}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Assistant Manager</span>
                      <span className="text-sm font-medium">{property?.assistant_manager}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Square Ft</span>
                      <span className="text-sm font-medium">{property?.square_ft}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Property Type</span>
                      <span className="text-sm font-medium">{property?.propertyType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Construction Year</span>
                      <span className="text-sm font-medium">{property?.construction_year}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Tenure</span>
                      <span className="text-sm font-medium">{property?.tenure}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-primary-grey mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Contact</span>
                      <span className="text-sm font-medium">{property?.contact_phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Email</span>
                      <span className="text-sm font-medium">{property?.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Floors</span>
                      <span className="text-sm font-medium">{property?.floors}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Occupants</span>
                      <span className="text-sm font-medium">{property?.occupants}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Local Fire Brigade</span>
                      <span className="text-sm font-medium">{property?.local_fire_brigade}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Fire Strategy</span>
                      <span className="text-sm font-medium">{property?.fire_strategy}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Evacuation Policy</span>
                      <span className="text-sm font-medium">{property?.evacuation_policy}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Emergency Contact</span>
                      <span className="text-sm font-medium">{property?.emergency_contact}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-grey-outline">
                      <span className="text-sm text-primary-grey">Contractor Hours</span>
                      <span className="text-sm font-medium">{property?.contactor_hours}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Protection Assets</h3>
                <div className="bg-white rounded-lg border border-grey-outline overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-grey-fill border-b border-grey-outline">
                    <div className="text-sm font-medium text-primary-grey">Asset</div>
                    <div className="text-sm font-medium text-primary-grey">Last Checked</div>
                    <div className="text-sm font-medium text-primary-grey">Status</div>
                  </div>
                  {protectionAssets.map((asset, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-4 border-b border-grey-outline last:border-0">
                      <div className="text-sm">{asset.asset}</div>
                      <div className="text-sm">{asset.lastChecked}</div>
                      <div className="text-sm">
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          {asset.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails