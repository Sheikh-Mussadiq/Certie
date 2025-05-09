import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const AdditionalServices = ({ onSubmit }) => {
  const [selectedType, setSelectedType] = useState('')
  const [floors, setFloors] = useState('')
  const [size, setSize] = useState('')
  const [tenants, setTenants] = useState('')
  const [showSecondStep, setShowSecondStep] = useState(false)
  const [selectedBuildingCategory, setSelectedBuildingCategory] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  
  const handleContinue = () => {
    if (selectedType && floors && size && tenants) {
      setShowSecondStep(true)
    }
  }

  const handleSubmit = () => {
    if (selectedBuildingCategory) {
      onSubmit({
        propertyType: selectedType,
        floors,
        size,
        tenants,
        buildingCategory: selectedBuildingCategory,
        additionalInfo
      })
    }
  }

  const buildingCategories = [
    'Block of flats',
    'HMO (House in Multiple Occupation)',
    'Care Home',
    'Construction Site',
    'Flat/Apartment',
    'Mixed Use (Residential with Commercial)',
    'Student Occupation'
  ]
  
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        {!showSecondStep ? (
          <>
            <h3 className="font-semibold text-lg mb-2">Choose your Building Type</h3>
            <p className="text-sm text-primary-grey mb-4">Select your property type and provide additional details.</p>
            
            <div className="flex flex-col gap-3 mb-6">
              <label className={`relative flex items-center border rounded-md p-4 cursor-pointer transition-all ${
                selectedType === 'residential' ? 'border-primary-orange bg-red-50' : 'border-grey-outline'
              }`}>
                <input
                  type="radio"
                  name="buildingType"
                  value="residential"
                  checked={selectedType === 'residential'}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="sr-only"
                />
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedType === 'residential' ? 'border-primary-orange' : 'border-grey-outline'
                }`}>
                  {selectedType === 'residential' && <span className="w-3 h-3 rounded-full bg-primary-orange"></span>}
                </span>
                <span className="font-medium">Residential</span>
              </label>
              
              <label className={`relative flex items-center border rounded-md p-4 cursor-pointer transition-all ${
                selectedType === 'commercial' ? 'border-primary-orange bg-red-50' : 'border-grey-outline'
              }`}>
                <input
                  type="radio"
                  name="buildingType"
                  value="commercial"
                  checked={selectedType === 'commercial'}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="sr-only"
                />
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedType === 'commercial' ? 'border-primary-orange' : 'border-grey-outline'
                }`}>
                  {selectedType === 'commercial' && <span className="w-3 h-3 rounded-full bg-primary-orange"></span>}
                </span>
                <span className="font-medium">Commercial</span>
              </label>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">How many floors do you have?</h3>
                <div className="relative">
                  <select
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-primary-orange"
                  >
                    <option value="">Select number of floors</option>
                    <option>1-3 Floors</option>
                    <option>4-6 Floors</option>
                    <option>7-10 Floors</option>
                    <option>More than 10 Floors</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What's the Approx Sq Ft of the Building?</h3>
                <div className="relative">
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-primary-orange"
                  >
                    <option value="">Select building size</option>
                    <option>Less than 1,000 sqft</option>
                    <option>1,000 - 3,000 sqft</option>
                    <option>3,000 - 5,000 sqft</option>
                    <option>5,000 - 10,000 sqft</option>
                    <option>More than 10,000 sqft</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How many Tenants do you have?</h3>
                <div className="relative">
                  <select
                    value={tenants}
                    onChange={(e) => setTenants(e.target.value)}
                    className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-primary-orange"
                  >
                    <option value="">Select number of tenants</option>
                    <option>10 or fewer</option>
                    <option>11-25</option>
                    <option>26-50</option>
                    <option>51-100</option>
                    <option>More than 100</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-semibold text-lg mb-2">Select Building Category</h3>
            <p className="text-sm text-primary-grey mb-4">Choose the category that best describes your building.</p>
            
            <div className="flex flex-col gap-3 mb-6">
              {buildingCategories.map((category) => (
                <label 
                  key={category}
                  className={`relative flex items-center border rounded-md p-4 cursor-pointer transition-all ${
                    selectedBuildingCategory === category ? 'border-primary-orange bg-red-50' : 'border-grey-outline'
                  }`}
                >
                  <input
                    type="radio"
                    name="buildingCategory"
                    value={category}
                    checked={selectedBuildingCategory === category}
                    onChange={(e) => {
                      setSelectedBuildingCategory(e.target.value)
                      handleSubmit()
                    }}
                    className="sr-only"
                  />
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    selectedBuildingCategory === category ? 'border-primary-orange' : 'border-grey-outline'
                  }`}>
                    {selectedBuildingCategory === category && <span className="w-3 h-3 rounded-full bg-primary-orange"></span>}
                  </span>
                  <span className="font-medium">{category}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Information</label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Please provide any additional details about your building..."
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange min-h-[100px]"
              />
            </div>
          </>
        )}

        {!showSecondStep && selectedType && floors && size && tenants && (
          <div className="mt-6">
            <button
              onClick={handleContinue}
              className="w-full bg-primary-orange text-white py-3 rounded-md font-medium hover:bg-[#e54a30] transition-colors"
            >
              Continue to Next Step
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AdditionalServices