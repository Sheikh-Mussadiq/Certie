import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const BookingCompleted = () => {
  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-24 h-24 bg-[#FF5436] rounded-full mx-auto mb-8 flex items-center justify-center"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-4"
      >
        Booking Completed
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8"
      >
        Enable plane backwards needle optimize synergy. Shelf-ware or hill want on land bandwagon
        opportunity great team. Stand existing skulls hammer winning unlock I loss.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 justify-center"
      >
        <button className="px-6 py-3 bg-[#151718] text-white rounded-md font-medium hover:bg-black transition-colors">
          See Bookings
        </button>
        <button className="px-6 py-3 border border-grey-outline rounded-md font-medium hover:bg-gray-50 transition-colors">
          Book Another Service
        </button>
      </motion.div>
    </div>
  )
}

export default BookingCompleted