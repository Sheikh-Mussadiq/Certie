import { motion } from 'framer-motion'

const MapView = () => {
  return (
    <motion.div 
      className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <img 
        src="https://images.pexels.com/photos/4318236/pexels-photo-4318236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
        alt="Map of UK service areas" 
        className="w-full h-[400px] object-cover"
      />
    </motion.div>
  )
}

export default MapView