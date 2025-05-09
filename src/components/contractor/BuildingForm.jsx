import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const BuildingForm = () => {
  const [buildingType, setBuildingType] = useState('residential')
  const [floors, setFloors] = useState('1-3 Floors')
  const [size, setSize] = useState('Select the Size e.g (250 sqft - 450 sqft)')
  const [tenants, setTenants] = useState('10 or fewer')
  
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Choose your Building Type</h3>
        <p className="text-sm text-primary-grey mb-4">Enable plans buttondown rebuke nobistate synergy. Shelf-ware of hit want on land blindwhagon opportunity great team.</p>
        
        <div className="flex flex-col gap-3">
          <label className={`relative flex items-center border rounded-md p-4 cursor-pointer transition-all ${buildingType === 'residential' ? 'border-primary-orange bg-red-50' : 'border-grey-outline'}`}>
            <input
              type="radio"
              name="buildingType"
              value="residential"
              checked={buildingType === 'residential'}
              onChange={() => setBuildingType('residential')}
              className="sr-only"
            />
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${buildingType === 'residential' ? 'border-primary-orange' : 'border-grey-outline'}`}>
              {buildingType === 'residential' && <span className="w-3 h-3 rounded-full bg-primary-orange"></span>}
            </span>
            <span className="font-medium">Residential</span>
          </label>
          
          <label className={`relative flex items-center border rounded-md p-4 cursor-pointer transition-all ${buildingType === 'commercial' ? 'border-primary-orange bg-red-50' : 'border-grey-outline'}`}>
            <input
              type="radio"
              name="buildingType"
              value="commercial"
              checked={buildingType === 'commercial'}
              onChange={() => setBuildingType('commercial')}
              className="sr-only"
            />
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${buildingType === 'commercial' ? 'border-primary-orange' : 'border-grey-outline'}`}>
              {buildingType === 'commercial' && <span className="w-3 h-3 rounded-full bg-primary-orange"></span>}
            </span>
            <span className="font-medium">Commercial</span>
          </label>
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