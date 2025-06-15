import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LocationSelector from "../components/contractor/LocationSelector";
import BookingDetails from "../components/contractor/BookingDetails";
import AuthModal from "../components/contractor/AuthModal";
import { getPropertyById } from "../services/propertiesServices";
import { createBooking } from "../services/bookingServices";
import ContractorNavbar from "../components/contractor/ContractorNavbar";

const ContractorWorkflow = () => {
  const location = useLocation();
  const [postcode, setPostcode] = useState("");
  const [currentStep, setCurrentStep] = useState("location");
  const [buildingType, setBuildingType] = useState("");
  const [additionalServices, setAdditionalServices] = useState([]);
  const [contactDetails, setContactDetails] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [property, setProperty] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { propertyId: propId, startAtStep } = location.state;

      if (propId) {
        setPropertyId(propId);
        const fetchProperty = async () => {
          const propertyData = await getPropertyById(propId);
          setProperty(propertyData);
          setPostcode(propertyData.postcode);
          setBuildingType(propertyData.property_type);
          if (propertyData.property_type) {
            setCurrentStep("additional-services");
          }
        };
        fetchProperty();
      }

      if (location.state?.startAtStep === 2) {
        setCurrentStep("additional-services");
      }
    }
  }, [location.state]);

  const handleLocationSubmit = (submittedPostcode) => {
    setPostcode(submittedPostcode);
    setCurrentStep("building-type");
  };

  const handleBuildingTypeSubmit = (type) => {
    setBuildingType(type);
    setCurrentStep("additional-services");
  };

  const handleAdditionalServicesSubmit = (services) => {
    setAdditionalServices(services);
    setCurrentStep("time-date");
  };

  const handleTimeAndDateSubmit = (data) => {
    setDateTime(data);
    setCurrentStep("contact");
  };

  const handleContactSubmit = (details) => {
    setContactDetails(details);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (details) => {
    setPaymentDetails(details);
  };

  const handleFinalizeBooking = async () => {
    console.log("Attempting to finalize booking with data:", {
      propertyId,
      dateTime,
      contactDetails,
      additionalServices,
      buildingType,
      paymentDetails,
    });
    setIsBooking(true);
    setBookingError(null);

    try {
      const servicesToBook = additionalServices?.services;

      if (!servicesToBook || servicesToBook.length === 0) {
        setBookingError(
          "No services selected. Please go back and select at least one service."
        );
        setIsBooking(false);
        return;
      }

      const combinedDateTime = new Date(dateTime.date);
      const [time, modifier] = dateTime.time.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);

      if (modifier.toUpperCase() === "PM" && hours < 12) {
        hours += 12;
      }
      if (modifier.toUpperCase() === "AM" && hours === 12) {
        hours = 0; // Midnight case
      }

      combinedDateTime.setHours(hours, minutes, 0, 0);

      const creationPromises = servicesToBook.map((service) =>
        createBooking({
          property_id: propertyId,
          property_name: property.name,
          assessment_time: combinedDateTime.toISOString(),
          contact_details: contactDetails,
          type: service,
          building_type: buildingType,
          // TODO: Add user_id and payment details securely
        })
      );

      await Promise.all(creationPromises);
      console.log("Bookings created for services:", servicesToBook);
      setCurrentStep("complete");
    } catch (error) {
      setBookingError("Failed to create booking(s). Please try again.");
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleBookAnother = () => {
    setPostcode("");
    setCurrentStep("additional-services");
    setBuildingType("");
    setAdditionalServices([]);
    setContactDetails(null);
    setPropertyId(null);
    setProperty(null);
    setDateTime(null);
    setPaymentDetails(null);
    setBookingError(null);
  };

  const handleGoBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("contact");
    } else if (currentStep === "contact") {
      setCurrentStep("time-date");
    } else if (currentStep === "time-date") {
      setCurrentStep("additional-services");
    } else if (currentStep === "additional-services") {
      setCurrentStep("building-type");
    } else {
      setCurrentStep("location");
    }
  };

  const handleLogin = async (credentials) => {
    // TODO: Implement actual login logic
    console.log("Login:", credentials);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    handleFinalizeBooking();
  };

  const handleSignup = () => {
    // TODO: Implement signup logic
    console.log("Navigate to signup");
  };

  return (
    <>
      <ContractorNavbar />
      <main className="max-w-[1440px] w-full mx-auto px-8 py-8">
        {isBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-medium">Finalizing your booking...</p>
            </div>
          </div>
        )}
        {bookingError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{bookingError}</span>
          </div>
        )}
        {currentStep === "location" ? (
          <LocationSelector
            postcode={postcode}
            setPostcode={setPostcode}
            onSubmit={handleLocationSubmit}
          />
        ) : (
          <BookingDetails
            postcode={postcode}
            property={property}
            propertyId={propertyId}
            currentStep={currentStep}
            onGoBack={handleGoBack}
            onBuildingTypeSubmit={handleBuildingTypeSubmit}
            onAdditionalServicesSubmit={handleAdditionalServicesSubmit}
            onTimeAndDateSubmit={handleTimeAndDateSubmit}
            onContactSubmit={handleContactSubmit}
            onPaymentSubmit={handlePaymentSubmit}
            onFinalizeBooking={handleFinalizeBooking}
            onBookAnother={handleBookAnother}
            paymentDetails={paymentDetails}
            dateTime={dateTime}
          />
        )}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      </main>
    </>
  );
};

export default ContractorWorkflow;
