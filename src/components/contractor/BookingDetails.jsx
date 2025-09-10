import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import ProgressTracker from "./ProgressTracker";
import BuildingForm from "./BuildingForm";
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
  propertyId,
  currentStep,
  onGoBack,
  onBuildingTypeSubmit,
  onBuildingTypeUpdate,
  onAdditionalServicesSubmit,
  onTimeAndDateSubmit,
  onTimeAndDateContinue,
  onContactSubmit,
  // onPaymentSubmit,
  // paymentDetails,
  dateTime,
  onFinalizeBooking,
  onBookAnother,
}) => {
  const [selectedBuildingType, setSelectedBuildingType] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postcodeValue, setPostcodeValue] = useState("");
  const [floors, setFloors] = useState("");
  const [size, setSize] = useState("");
  const [tenants, setTenants] = useState("");
  const [selectedAdditionalServices, setSelectedAdditionalServices] =
    useState(null);

  const [contactFormData, setContactFormData] = useState(null);
  const [isContactFormValid, setIsContactFormValid] = useState(false);

  useEffect(() => {
    if (property?.property_type) {
      setSelectedBuildingType(property.property_type);
      setStreet(property.address?.street || "");
      setCity(property.address?.city || "");
      setPostcodeValue(property.address?.postcode || "");
      setFloors(property.floors || "");
      setSize(property.square_ft || "");
      setTenants(property.occupants || "");
    }
  }, [property]);

  const handleBuildingDataChange = useCallback((data) => {
    setSelectedBuildingType(data.buildingType);
    if (data.propertyName) {
      setPropertyName(data.propertyName);
    }
    if (data.street) {
      setStreet(data.street);
    }
    if (data.city) {
      setCity(data.city);
    }
    if (data.postcode) {
      setPostcodeValue(data.postcode);
    }
    if (data.floors) {
      setFloors(data.floors);
    }
    if (data.size) {
      setSize(data.size);
    }
    if (data.tenants) {
      setTenants(data.tenants);
    }
  }, []);

  const handleAdditionalServicesSubmit = useCallback((data) => {
    setSelectedAdditionalServices(data);
  }, []);

  const handleBuildingTypeUpdate = useCallback(
    (newBuildingType) => {
      setSelectedBuildingType(newBuildingType);
      // Call parent callback if provided
      if (onBuildingTypeUpdate) {
        onBuildingTypeUpdate(newBuildingType);
      }
    },
    [onBuildingTypeUpdate]
  );

  const handleTimeAndDateSubmit = (data) => {
    onTimeAndDateSubmit(data);
  };

  // New function to handle time and date changes without navigation
  const handleTimeAndDateChange = useCallback(
    (data) => {
      // Just pass the data to the parent component without triggering navigation
      onTimeAndDateSubmit(data);
    },
    [onTimeAndDateSubmit]
  );

  const handleContactDataChange = useCallback((data) => {
    setContactFormData(data);
    if (data.name && data.email && data.phone) {
      setIsContactFormValid(true);
    } else {
      setIsContactFormValid(false);
    }
  }, []);

  // const handlePaymentFormSubmit = (data) => {
  //   onPaymentSubmit(data);
  // };

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

                <motion.button
                  onClick={() => {
                    if (
                      currentStep === "property-details" &&
                      selectedBuildingType
                    ) {
                      onBuildingTypeSubmit(
                        selectedBuildingType,
                        propertyName,
                        street,
                        city,
                        postcodeValue,
                        floors,
                        size,
                        tenants
                      );
                    } else if (
                      currentStep === "service-details" &&
                      selectedAdditionalServices
                    ) {
                      onAdditionalServicesSubmit(selectedAdditionalServices);
                    } else if (currentStep === "time-date" && dateTime) {
                      onTimeAndDateContinue();
                    } else if (currentStep === "contact" && contactFormData) {
                      onContactSubmit(contactFormData);
                      onFinalizeBooking(contactFormData);
                    }
                  }}
                  disabled={
                    (currentStep === "property-details" &&
                      !selectedBuildingType) ||
                    (currentStep === "service-details" &&
                      (!selectedAdditionalServices ||
                        selectedAdditionalServices.services.length === 0)) ||
                    (currentStep === "time-date" && !dateTime) ||
                    (currentStep === "contact" && !isContactFormValid)
                  }
                  className={`px-5 py-2 text-white rounded-lg font-medium text-sm ${
                    (currentStep === "property-details" &&
                      selectedBuildingType) ||
                    (currentStep === "service-details" &&
                      selectedAdditionalServices &&
                      selectedAdditionalServices.services.length > 0) ||
                    (currentStep === "time-date" && dateTime) ||
                    (currentStep === "contact" && isContactFormValid)
                      ? "bg-primary-black hover:bg-primary-black/80"
                      : "bg-primary-grey cursor-not-allowed"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                </motion.button>
              </div>
            </div>

            <div className="bg-grey-fill rounded-b-xl p-6 border-t border-grey-outline">
              <ProgressTracker currentStep={currentStep} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {currentStep === "property-details" && (
                <BuildingForm
                  property={property}
                  onDataChange={handleBuildingDataChange}
                  onBuildingTypeUpdate={handleBuildingTypeUpdate}
                  initialData={{
                    buildingType: selectedBuildingType,
                    propertyName,
                    street,
                    city,
                    postcode: postcodeValue,
                    floors,
                    size,
                    tenants,
                  }}
                />
              )}
              {currentStep === "service-details" && (
                <AdditionalServicesForm
                  onSubmit={handleAdditionalServicesSubmit}
                  buildingCategory={
                    typeof selectedBuildingType === "object"
                      ? selectedBuildingType.type
                      : selectedBuildingType
                  }
                  property={property}
                  onBuildingTypeUpdate={handleBuildingTypeUpdate}
                />
              )}
              {currentStep === "time-date" && (
                <TimeAndDateForm onDataChange={handleTimeAndDateChange} />
              )}
              {currentStep === "contact" && (
                <ContactForm
                  onDataChange={handleContactDataChange}
                  property={property}
                />
              )}
            </div>

            <div className="md:col-span-1 space-y-8">
              <div className="sticky top-20 space-y-8">
                <ServiceSummary
                  postcode={postcode}
                  floors={floors}
                  size={size}
                  tenants={tenants}
                  address={`${street}, ${city}`}
                  property={property}
                  buildingType={selectedBuildingType}
                  additionalServices={selectedAdditionalServices}
                  dateTime={dateTime}
                  contactDetails={contactFormData}
                />
                {currentStep !== "complete" && <FAQAccordion />}
              </div>
            </div>
          </div>
        </>
      ) : (
        <BookingCompleted
          propertyId={propertyId}
          onBookAnother={onBookAnother}
        />
      )}
    </div>
  );
};

export default BookingDetails;
