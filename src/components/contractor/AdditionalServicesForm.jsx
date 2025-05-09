import { useState } from 'react'
import { motion } from 'framer-motion'

const AdditionalServicesForm = ({ onSubmit }) => {
  const [selectedServices, setSelectedServices] = useState([])
  const [otherService, setOtherService] = useState('')
  
  const services = [
    'PAT Testing',
    'Emergency Light Testing',
    'Issue No 1',
    'Gas Safety Certificate',
    'Issue No 1',
    'Issue No 1',
    'Issue No 1',
    'Others'
  ]
  
  const handleServiceChange = (service) => {
    if (selectedServices.includes(service)) {
      const newServices = selectedServices.filter(s => s !== service)
      setSelectedServices(newServices)
      onSubmit(newServices)
    } else {
      const newServices = [...selectedServices, service]
      setSelectedServices(newServices)
      onSubmit(newServices)
    }
  }
  
  const handleOtherServiceChange = (e) => {
    const value = e.target.value
    setOtherService(value)
    if (selectedServices.includes('Others')) {
      onSubmit([...selectedServices.filter(s => s !== 'Others'), `Others: ${value}`])
    }
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Do you need any additional Services?</h3>
        <p className="text-sm text-primary-grey mb-6">
          Enable plane backwards needle optimize synergy. Shelf-ware or hill want on land bandwagon opportunity great team. Stand existing skulls hammer winning unlock I loss.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <label 
              key={service}
              className={`relative flex items-center border rounded-md p-4 cursor-pointer transition-all ${
                selectedServices.includes(service) ? 'border-primary-orange bg-red-50' : 'border-grey-outline'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => handleServiceChange(service)}
                className="sr-only"
              />
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                selectedServices.includes(service) ? 'border-primary-orange' : 'border-grey-outline'
              }`}>
                {selectedServices.includes(service) && (
                  <span className="w-3 h-3 rounded-full bg-primary-orange"></span>
                )}
              </span>
              <span className="font-medium text-gray-700">{service}</span>
            </label>
          ))}
        </div>
        
        {selectedServices.includes('Others') && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Please Specify</label>
            <input
              type="text"
              value={otherService}
              onChange={handleOtherServiceChange}
              placeholder="Enter Text Here"
              className="w-full p-4 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AdditionalServicesForm