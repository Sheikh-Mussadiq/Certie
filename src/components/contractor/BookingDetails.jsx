import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ProgressTracker from "./ProgressTracker";
import AdditionalServices from "./AdditionalServices";
import AdditionalServicesForm from "./AdditionalServicesForm";
import TimeAndDateForm from "./TimeAndDateForm";
import ContactForm from "./ContactForm";
import PaymentForm from "./PaymentForm";
import ServiceSummary from "./ServiceSummary";
import BookingCompleted from "./BookingCompleted";
import FAQAccordion from "./FAQAccordion";

const BookingDetails = ({
  postcode,
  property,
  currentStep,
  onGoBack,
  onBuildingTypeSubmit,
  onAdditionalServicesSubmit,
  onTimeAndDateSubmit,
  onContactSubmit,
  onPaymentSubmit,
}) => {
  const [selectedBuildingType, setSelectedBuildingType] = useState("");
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState(
    null
  );
  const [showServices, setShowServices] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [contactFormData, setContactFormData] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState(null);

  const handleBuildingTypeSubmit = (type) => {
    setSelectedBuildingType(type);
  };

  const handleAdditionalServicesSubmit = useCallback((data) => {
    setSelectedAdditionalServices(data);
  }, []);

  const handleTimeAndDateSubmit = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  const handleContactFormSubmit = (data) => {
    if (
      data.name &&
      data.email &&
      data.phone &&
      data.address &&
      data.postcode
    ) {
      setContactFormData(data);
    }
  };

  const handlePaymentFormSubmit = (data) => {
    if (data.cardNumber && data.nameOnCard && data.expiryDate && data.cvv) {
      setPaymentFormData(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      {currentStep !== "complete" ? (
        <>
          <div className="border border-grey-outline rounded-xl mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full p-4">
              <div>
                <h2 className="text-xl text-primary-black font-bold">
                  Booking Details
                </h2>
                <p className="text-base text-primary-grey">
                  Check the next stage for your deal
                </p>
              </div>

              <div className="flex space-x-3 mt-4 sm:mt-0">
                <motion.button
                  onClick={onGoBack}
                  className="px-5 py-2 border border-grey-outline rounded-lg font-medium text-sm text-primary-black"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go back
                </motion.button>

                {!(currentStep === 'additional-services' && !showServices) && (
                  <motion.button
                    onClick={() => {
                      if (
                        currentStep === "building-type" &&
                        selectedBuildingType
                      ) {
                        onBuildingTypeSubmit(selectedBuildingType);
                      } else if (
                        currentStep === "additional-services" &&
                        selectedAdditionalServices
                      ) {
                        onAdditionalServicesSubmit(selectedAdditionalServices);
                      } else if (
                        currentStep === "time-date" &&
                        selectedDateTime
                      ) {
                        onTimeAndDateSubmit(selectedDateTime);
                      } else if (currentStep === "contact" && contactFormData) {
                        onContactSubmit(contactFormData);
                      } else if (currentStep === "payment" && paymentFormData) {
                        onPaymentSubmit(paymentFormData);
                      }
                    }}
                    disabled={
                      (currentStep === "building-type" &&
                        !selectedBuildingType) ||
                      (currentStep === "additional-services" &&
                        (!selectedAdditionalServices || !selectedAdditionalServices.buildingCategory)) ||
                      (currentStep === "time-date" && !selectedDateTime) ||
                      (currentStep === "contact" && !contactFormData) ||
                      (currentStep === "payment" && !paymentFormData)
                    }
                    className={`px-5 py-2 text-white rounded-lg font-medium text-sm ${
                      (currentStep === "building-type" && selectedBuildingType) ||
                      (currentStep === "additional-services" &&
                        selectedAdditionalServices && selectedAdditionalServices.buildingCategory) ||
                      (currentStep === "time-date" && selectedDateTime) ||
                      (currentStep === "contact" && contactFormData) ||
                      (currentStep === "payment" && paymentFormData)
                        ? "bg-primary-black hover:bg-primary-black/80"
                        : "bg-primary-grey cursor-not-allowed"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                  </motion.button>
                )}
              </div>
            </div>

            <div className="bg-grey-fill rounded-b-xl p-6 border-t border-grey-outline">
              <ProgressTracker currentStep={currentStep} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {currentStep === "building-type" && (
                <AdditionalServices onSubmit={handleBuildingTypeSubmit} />
              )}
              {currentStep === "additional-services" && (
                <AdditionalServicesForm
                  onSubmit={handleAdditionalServicesSubmit}
                  showServices={showServices}
                  onContinue={() => setShowServices(true)}
                />
              )}
              {currentStep === "time-date" && (
                <TimeAndDateForm onSubmit={handleTimeAndDateSubmit} />
              )}
              {currentStep === "contact" && (
                <ContactForm onSubmit={handleContactFormSubmit} />
              )}
              {currentStep === "payment" && (
                <PaymentForm onSubmit={handlePaymentFormSubmit} />
              )}
            </div>

            <div className="md:col-span-1 space-y-8">
              <ServiceSummary
                postcode={postcode}
                property={property}
                buildingType={selectedBuildingType}
                additionalServices={selectedAdditionalServices?.services}
                dateTime={selectedDateTime}
                contactDetails={contactFormData}
              />
              {currentStep !== "complete" && <FAQAccordion />}
            </div>
          </div>
        </>
      ) : (
        <BookingCompleted />
      )}
    </div>
  );
};

export default BookingDetails;
