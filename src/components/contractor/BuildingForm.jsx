import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const BuildingForm = ({ property, onDataChange, initialData }) => {
  const [buildingType, setBuildingType] = useState(initialData?.buildingType || '')
  const [propertyName, setPropertyName] = useState(initialData?.propertyName || '')
  const [floors, setFloors] = useState('1-3 Floors')
  const [size, setSize] = useState('Select the Size e.g (250 sqft - 450 sqft)')
  const [tenants, setTenants] = useState('10 or fewer')

  const property_types = [
    "Residential Block",
    "Single Residential Dwelling",
    "Commercial Office",
    "Mixed-Use Building",
    "School / Education",
    "Retail Unit",
    "Warehouse / Industrial",
    "HMO (House in Multiple Occupation)",
    "Care Facility",
    "Hotel",
    "Other",
  ];

  useEffect(() => {
    if (property) {
      setBuildingType(property.property_type || '')
    }
  }, [property])

  useEffect(() => {
    onDataChange({ buildingType, propertyName })
  }, [buildingType, propertyName, onDataChange])

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {!property && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-2">Property Name</h3>
          <p className="text-sm text-primary-grey mb-4">
            Please provide a name for this new property.
          </p>
          <input
            type="text"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
            placeholder="e.g., The Grand Building"
            required
          />
        </div>
      )}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Choose your Building Type</h3>
        <p className="text-sm text-primary-grey mb-4">Enable plans buttondown rebuke nobistate synergy. Shelf-ware of hit want on land blindwhagon opportunity great team.</p>
        
        <div className="relative">
          <select
            value={buildingType}
            onChange={(e) => setBuildingType(e.target.value)}
            className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-primary-orange"
            required
          >
            <option value="" disabled>Select a building type</option>
            {property_types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">How many floors do you have?</h3>
        <p className="text-sm text-primary-grey mb-4">This helps determine the time needed and helps us to assign the right assessor for your building.</p>
        
        <div className="relative">
          <select
            value={floors}
            onChange={(e) => setFloors(e.target.value)}
            className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-primary-orange"
          >
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
      
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">What's the Approx Sq Ft of the Building?</h3>
        <p className="text-sm text-primary-grey mb-4">Enable plans buttondown rebuke nobistate synergy. Shelf-ware of hit want on land blindwhagon opportunity great team.</p>
        
        <div className="relative">
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-primary-orange"
          >
            <option>Select the Size e.g (250 sqft - 450 sqft)</option>
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
      
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">How many Tenants do you have</h3>
        <p className="text-sm text-primary-grey mb-4">Enable plans buttondown rebuke nobistate synergy. Shelf-ware of hit want on land blindwhagon opportunity great team.</p>
        
        <div className="relative">
          <select
            value={tenants}
            onChange={(e) => setTenants(e.target.value)}
            className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-primary-orange"
          >
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
    </motion.div>
  )
}

export default BuildingForm