import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LocationSelector from "../components/contractor/LocationSelector";
import BookingDetails from "../components/contractor/BookingDetails";
import AuthModal from "../components/contractor/AuthModal";
import { getPropertyById } from '../services/propertiesServices';
import ContractorNavbar from '../components/contractor/ContractorNavbar';

const ContractorWorkflow = () => {
  const location = useLocation();
  const [postcode, setPostcode] = useState("");
  const [currentStep, setCurrentStep] = useState("location");
  const [buildingType, setBuildingType] = useState("");
  const [additionalServices, setAdditionalServices] = useState([]);
  const [contactDetails, setContactDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [property, setProperty] = useState(null);

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
        };
        fetchProperty();
      }

      if (location.state?.startAtStep === 2) {
        setCurrentStep('additional-services');
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

  const handleTimeAndDateSubmit = (dateTime) => {
    setCurrentStep("contact");
  };

  const handleContactSubmit = (details) => {
    setContactDetails(details);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (details) => {
    setPaymentDetails(details);
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setCurrentStep("complete");
    }
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
    setCurrentStep("complete");
  };

  const handleSignup = () => {
    // TODO: Implement signup logic
    console.log("Navigate to signup");
  };

  return (
    <>
      <ContractorNavbar />
      <main className="max-w-[1440px] w-full mx-auto px-8 py-8">
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
            currentStep={currentStep}
            onGoBack={handleGoBack}
            onBuildingTypeSubmit={handleBuildingTypeSubmit}
            onAdditionalServicesSubmit={handleAdditionalServicesSubmit}
            onTimeAndDateSubmit={handleTimeAndDateSubmit}
            onContactSubmit={handleContactSubmit}
            onPaymentSubmit={handlePaymentSubmit}
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
