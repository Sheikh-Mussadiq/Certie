import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import MapView from './MapView'

const LocationSelector = ({ postcode, setPostcode, onSubmit }) => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Postcode submitted:', postcode)
    onSubmit(postcode)
  }
  
  return (
    <motion.div 
      className="w-full flex flex-col items-center mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#151718]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Where Should we Serve you?
      </motion.h1>
      
      <motion.form 
        className="w-full max-w-md mb-10"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your Postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            className="input-field pr-10"
            required
          />
          <motion.div 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            animate={{ 
              scale: isInputFocused ? 1.1 : 1,
              color: isInputFocused ? '#FF5436' : '#9CA3AF'
            }}
          >
            <MapPin size={20} />
          </motion.div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <motion.button
            type="submit"
            className="btn-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Continue
          </motion.button>
        </div>
      </motion.form>
      
      <MapView />
    </motion.div>
  )
}

export default LocationSelector