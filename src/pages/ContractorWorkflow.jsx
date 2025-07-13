import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LocationSelector from "../components/contractor/LocationSelector";
import BookingDetails from "../components/contractor/BookingDetails";
import AuthModal from "../components/contractor/AuthModal";
import {
  getPropertyById,
  createProperty,
} from "../services/propertiesServices";
import { createBooking } from "../services/bookingServices";
import ContractorNavbar from "../components/contractor/ContractorNavbar";
import { useAuth } from "../context/AuthContext";

const ContractorWorkflow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const [postcode, setPostcode] = useState("");
  const [currentStep, setCurrentStep] = useState("location");
  const [buildingType, setBuildingType] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [additionalServices, setAdditionalServices] = useState([]);
  const [contactDetails, setContactDetails] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [property, setProperty] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const processPendingWorkflow = async () => {
      const pendingWorkflowRaw = localStorage.getItem("pendingWorkflow");
      if (isAuthenticated && currentUser && pendingWorkflowRaw) {
        const pendingWorkflow = JSON.parse(pendingWorkflowRaw);

        setIsBooking(true);
        setBookingError(null);

        try {
          let propertyIdForBooking = propertyId;
          let propertyForBooking = property;

          if (!propertyIdForBooking && pendingWorkflow.propertyName) {
            const newProperty = await createProperty(
              {
                name: pendingWorkflow.propertyName,
                address: { postcode: pendingWorkflow.postcode },
                property_type: pendingWorkflow.buildingType,
              },
              currentUser.id
            );
            propertyIdForBooking = newProperty.id;
            propertyForBooking = newProperty;
            setProperty(newProperty);
            setPropertyId(newProperty.id);
          }

          if (!propertyIdForBooking) {
            throw new Error(
              "Could not find or create a property for the booking."
            );
          }

          const servicesToBook = pendingWorkflow.additionalServices?.services;
          if (!servicesToBook || servicesToBook.length === 0) {
            setBookingError("No services selected.");
            setIsBooking(false);
            return;
          }

          // Use the timestampz directly from dateTime object instead of recalculating
          const bookingTimestamp =
            pendingWorkflow.dateTime.timestampz || new Date().toISOString();

          const creationPromises = servicesToBook.map((service) =>
            createBooking({
              property_id: propertyIdForBooking,
              property_name:
                propertyForBooking?.name || pendingWorkflow.propertyName,
              booked_time: bookingTimestamp,
              contact_details: pendingWorkflow.contactDetails,
              type: service,
              building_type: pendingWorkflow.buildingType,
              // user_id: currentUser.id,
            })
          );

          await Promise.all(creationPromises);
          setCurrentStep("complete");
          localStorage.removeItem("pendingWorkflow");
        } catch (error) {
          setBookingError(`Failed to create booking(s). ${error.message}`);
          console.error(error);
        } finally {
          setIsBooking(false);
        }
      }
    };
    processPendingWorkflow();
  }, [isAuthenticated, currentUser, property, propertyId]);

  useEffect(() => {
    if (location.state) {
      const { propertyId: propId, startAtStep } = location.state;

      if (propId) {
        setPropertyId(propId);
        const fetchProperty = async () => {
          const propertyData = await getPropertyById(propId);
          setProperty(propertyData);
          setPostcode(propertyData.address?.postcode || "");
          setBuildingType(propertyData.property_type);
          if (propertyData.property_type) {
            setCurrentStep("service-details");
          }
        };
        fetchProperty();
      }

      if (location.state?.startAtStep === 2) {
        setCurrentStep("service-details");
      }
    }
  }, [location.state]);

  const handleLocationSubmit = (submittedPostcode) => {
    setPostcode(submittedPostcode);
    setCurrentStep("property-details");
  };

  const handleBuildingTypeSubmit = (type, name) => {
    setBuildingType(type);
    if (name) {
      setPropertyName(name);
    }
    setCurrentStep("service-details");
  };

  const handleAdditionalServicesSubmit = (services) => {
    setAdditionalServices(services);
    setCurrentStep("time-date");
  };

  const handleTimeAndDateSubmit = (data) => {
    setDateTime(data);
    // Don't automatically change the step here
    // The step will be changed when the user clicks Continue
  };

  const handleTimeAndDateContinue = () => {
    // Only change the step when explicitly called from the Continue button
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
    if (!isAuthenticated) {
      const workflowData = {
        postcode,
        buildingType,
        propertyName: property ? property.name : propertyName,
        additionalServices,
        dateTime,
        contactDetails,
        paymentDetails,
      };
      localStorage.setItem("pendingWorkflow", JSON.stringify(workflowData));
      navigate("/", {
        state: { from: location.pathname, pendingWorkflow: true },
      });
      return;
    }

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

      // Use the timestampz directly from dateTime object instead of recalculating
      const bookingTimestamp = dateTime.timestampz;

      const status =
        property.owner_id === currentUser.id ? "approved" : "pending";

      const creationPromises = servicesToBook.map((service) =>
        createBooking({
          property_id: propertyId,
          property_name: property.name,
          booked_time: bookingTimestamp,
          contact_details: contactDetails,
          type: service,
          building_type: buildingType,
          status,
          // user_id: currentUser.id,
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
    setCurrentStep("location");
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
      setCurrentStep("service-details");
    } else if (currentStep === "service-details") {
      setCurrentStep("property-details");
    } else if (currentStep === "property-details") {
      setCurrentStep("location");
    } else {
      setCurrentStep("location");
    }
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
            onTimeAndDateContinue={handleTimeAndDateContinue}
            onContactSubmit={handleContactSubmit}
            onPaymentSubmit={handlePaymentSubmit}
            onFinalizeBooking={handleFinalizeBooking}
            onBookAnother={handleBookAnother}
            paymentDetails={paymentDetails}
            dateTime={dateTime}
          />
        )}
      </main>
    </>
  );
};

export default ContractorWorkflow;
