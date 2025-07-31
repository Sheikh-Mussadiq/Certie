import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const BuildingForm = ({ property, onDataChange, initialData }) => {
  const [buildingType, setBuildingType] = useState(initialData?.buildingType || '')
  const [propertyName, setPropertyName] = useState(initialData?.propertyName || '')
  const [floors, setFloors] = useState(initialData?.floors || '')
  const [size, setSize] = useState(initialData?.size || '')
  const [tenants, setTenants] = useState(initialData?.tenants || '')

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
      setFloors(property.floors || '')
      setSize(property.square_ft || '')
      setTenants(property.occupants || '')
    }
  }, [property])

  useEffect(() => {
    onDataChange({ buildingType, propertyName, floors, size, tenants })
  }, [buildingType, propertyName, floors, size, tenants, onDataChange])

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
        
        <input
          type="number"
          value={floors}
          onChange={(e) => setFloors(e.target.value)}
          className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
          placeholder="Enter number of floors"
          min="1"
          max="200"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">What's the Approx Sq Ft of the Building?</h3>
        <p className="text-sm text-primary-grey mb-4">Enter the approximate square footage of your building.</p>
        
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
          placeholder="Enter square footage (e.g., 2500)"
          min="1"
          max="1000000"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">How many Tenants do you have</h3>
        <p className="text-sm text-primary-grey mb-4">Enter the number of tenants or occupants in your building.</p>
        
        <input
          type="number"
          value={tenants}
          onChange={(e) => setTenants(e.target.value)}
          className="w-full appearance-none bg-white border border-grey-outline rounded-md py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
          placeholder="Enter number of tenants (e.g., 25)"
          min="0"
          max="10000"
        />
      </div>
    </motion.div>
  )
}

export default BuildingForm