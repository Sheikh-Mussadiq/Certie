import { useState } from 'react'
import { motion } from 'framer-motion'
import ProgressTracker from './ProgressTracker'
import AdditionalServices from './AdditionalServices'
import AdditionalServicesForm from './AdditionalServicesForm'
import TimeAndDateForm from './TimeAndDateForm'
import ContactForm from './ContactForm'
import PaymentForm from './PaymentForm'
import ServiceSummary from './ServiceSummary'
import BookingCompleted from './BookingCompleted'
import FAQAccordion from './FAQAccordion'

const BookingDetails = ({ 
  postcode, 
  currentStep, 
  onGoBack, 
  onBuildingTypeSubmit,
  onAdditionalServicesSubmit,
  onTimeAndDateSubmit,
  onContactSubmit,
  onPaymentSubmit
}) => {
  const [selectedBuildingType, setSelectedBuildingType] = useState('')
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState([])
  const [selectedDateTime, setSelectedDateTime] = useState(null)
  const [contactFormData, setContactFormData] = useState(null)
  const [paymentFormData, setPaymentFormData] = useState(null)

  const handleBuildingTypeSubmit = (type) => {
    setSelectedBuildingType(type)
  }

  const handleAdditionalServicesSubmit = (services) => {
    setSelectedAdditionalServices(services)
  }

  const handleTimeAndDateSubmit = (dateTime) => {
    setSelectedDateTime(dateTime)
  }

  const handleContactFormSubmit = (data) => {
    if (data.name && data.email && data.phone && data.address && data.postcode) {
      setContactFormData(data)
    }
  }

  const handlePaymentFormSubmit = (data) => {
    if (data.cardNumber && data.nameOnCard && data.expiryDate && data.cvv) {
      setPaymentFormData(data)
    }
  }

  return (
    <div className="max-w-7xl mx-auto relative">
      {currentStep !== 'complete' ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Booking Details</h2>
              <p className="text-sm text-primary-grey">Check the next stage for your deal</p>
            </div>
            
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <motion.button
                onClick={onGoBack}
                className="px-5 py-2 border border-grey-outline rounded-md font-medium text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go back
              </motion.button>
              
              <motion.button
                onClick={() => {
                  if (currentStep === 'building-type' && selectedBuildingType) {
                    onBuildingTypeSubmit(selectedBuildingType)
                  } else if (currentStep === 'additional-services' && selectedAdditionalServices.length > 0) {
                    onAdditionalServicesSubmit(selectedAdditionalServices)
                  } else if (currentStep === 'time-date' && selectedDateTime) {
                    onTimeAndDateSubmit(selectedDateTime)
                  } else if (currentStep === 'contact' && contactFormData) {
                    onContactSubmit(contactFormData)
                  } else if (currentStep === 'payment' && paymentFormData) {
                    onPaymentSubmit(paymentFormData)
                  }
                }}
                disabled={
                  (currentStep === 'building-type' && !selectedBuildingType) ||
                  (currentStep === 'additional-services' && selectedAdditionalServices.length === 0) ||
                  (currentStep === 'time-date' && !selectedDateTime) ||
                  (currentStep === 'contact' && !contactFormData) ||
                  (currentStep === 'payment' && !paymentFormData)
                }
                className={`px-5 py-2 text-white rounded-md font-medium text-sm ${
                  ((currentStep === 'building-type' && selectedBuildingType) ||
                   (currentStep === 'additional-services' && selectedAdditionalServices.length > 0) ||
                   (currentStep === 'time-date' && selectedDateTime) ||
                   (currentStep === 'contact' && contactFormData) ||
                   (currentStep === 'payment' && paymentFormData))
                    ? 'bg-primary-orange hover:bg-[#e54a30]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <ProgressTracker currentStep={currentStep} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {currentStep === 'building-type' && (
                <AdditionalServices onSubmit={handleBuildingTypeSubmit} />
              )}
              {currentStep === 'additional-services' && (
                <AdditionalServicesForm onSubmit={handleAdditionalServicesSubmit} />
              )}
              {currentStep === 'time-date' && (
                <TimeAndDateForm onSubmit={handleTimeAndDateSubmit} />
              )}
              {currentStep === 'contact' && (
                <ContactForm onSubmit={handleContactFormSubmit} />
              )}
              {currentStep === 'payment' && (
                <PaymentForm onSubmit={handlePaymentFormSubmit} />
              )}
            </div>
            
            <div className="md:col-span-1 space-y-8">
              <ServiceSummary 
                postcode={postcode}
                buildingType={selectedBuildingType}
                additionalServices={selectedAdditionalServices}
                dateTime={selectedDateTime}
                contactDetails={contactFormData}
              />
              {currentStep !== 'complete' && <FAQAccordion />}
            </div>
          </div>
        </>
      ) : (
        <BookingCompleted />
      )}
    </div>
  )
}

export default BookingDetails