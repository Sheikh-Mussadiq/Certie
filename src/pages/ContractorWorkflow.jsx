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
import { supabase } from "../lib/supabase";
import ContractorNavbar from "../components/contractor/ContractorNavbar";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const ContractorWorkflow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const [postcode, setPostcode] = useState("");
  const [currentStep, setCurrentStep] = useState("property-details");
  const [buildingType, setBuildingType] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [floors, setFloors] = useState("");
  const [size, setSize] = useState("");
  const [tenants, setTenants] = useState("");
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
          let propertyOwnerId = currentUser.id || property?.owner_id || null;

          if (!propertyIdForBooking && pendingWorkflow.propertyName) {
            const newProperty = await createProperty(
              {
                name: pendingWorkflow.propertyName,
                address: {
                  street: pendingWorkflow.street,
                  city: pendingWorkflow.city,
                  postcode: pendingWorkflow.postcode,
                },
                property_type: pendingWorkflow.buildingType,
                floors: parseInt(pendingWorkflow.floors) || null,
                square_ft: parseInt(pendingWorkflow.size) || null,
                occupants: parseInt(pendingWorkflow.tenants) || null,
              },
              currentUser.id
            );
            propertyIdForBooking = newProperty.id;
            propertyForBooking = newProperty;
            propertyOwnerId = newProperty.owner_id;
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

          const creationPromises = servicesToBook.map((service) => {
            const bookingData = {
              property_id: propertyIdForBooking,
              property_name:
                propertyForBooking?.name || pendingWorkflow.propertyName,
              booked_time: bookingTimestamp,
              contact_details: pendingWorkflow.contactDetails,
              type: service,
              building_type: pendingWorkflow.buildingType,
              status: "approved",
            };

            // Add service-specific meta data
            if (
              service === "PAT Testing" &&
              pendingWorkflow.additionalServices.meta?.devices
            ) {
              bookingData.meta = {
                devices: pendingWorkflow.additionalServices.meta.devices,
              };
            } else if (
              service === "Fire Door Inspection" &&
              pendingWorkflow.additionalServices.meta?.doors
            ) {
              bookingData.meta = {
                doors: pendingWorkflow.additionalServices.meta.doors,
              };
            } else if (
              service === "Fire Risk Assessment" &&
              pendingWorkflow.additionalServices.meta?.option
            ) {
              const selectedOption =
                pendingWorkflow.additionalServices.meta.option;
              bookingData.meta = { fraMeta: selectedOption };
            }

            return createBooking(bookingData);
          });

          const createdBookings = await Promise.all(creationPromises);

          if (
            createdBookings &&
            createdBookings.length > 0 &&
            propertyForBooking &&
            currentUser &&
            propertyForBooking.owner_id === currentUser.id
          ) {
            const bookingIds = createdBookings.map((b) => b.id);
            console.log(
              "Property owner creating invoice for pending workflow booking IDs:",
              bookingIds
            );

            try {
              const { data: invoiceData, error: invoiceError } =
                await supabase.functions.invoke("create-invoice", {
                  body: { bookingIds },
                });

              if (invoiceError) {
                throw invoiceError;
              }

              console.log("Invoice created successfully:", invoiceData);
              toast.success("Invoice created for your booking.");
            } catch (error) {
              console.error("Failed to create invoice:", error);
              toast.error(`Failed to create invoice: ${error.message}`);
            }
          }

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
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (location.state) {
      const { propertyId: propId, startAtStep } = location.state;

      if (propId) {
        setPropertyId(propId);
        const fetchProperty = async () => {
          const propertyData = await getPropertyById(propId);
          setProperty(propertyData);
          setPostcode(propertyData.address?.postcode || "");
          setStreet(propertyData.address?.street || "");
          setCity(propertyData.address?.city || "");
          setBuildingType(propertyData.property_type);
          setFloors(propertyData.floors || "");
          setSize(propertyData.square_ft || "");
          setTenants(propertyData.occupants || "");
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

  const handleBuildingTypeSubmit = (
    type,
    name,
    streetValue,
    cityValue,
    postcodeValue,
    floorsValue,
    sizeValue,
    tenantsValue
  ) => {
    setBuildingType(type);
    if (name) {
      setPropertyName(name);
    }
    if (streetValue) {
      setStreet(streetValue);
    }
    if (cityValue) {
      setCity(cityValue);
    }
    if (postcodeValue) {
      setPostcode(postcodeValue);
    }
    if (floorsValue) {
      setFloors(floorsValue);
    }
    if (sizeValue) {
      setSize(sizeValue);
    }
    if (tenantsValue) {
      setTenants(tenantsValue);
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
    // No longer triggers finalization from here.
  };

  const handlePaymentSubmit = (details) => {
    setPaymentDetails(details);
  };

  const handleBuildingTypeUpdate = (newBuildingType) => {
    setBuildingType(newBuildingType);
    // Update property state if it exists
    if (property) {
      setProperty((prev) => ({
        ...prev,
        property_type: newBuildingType,
      }));
    }
  };

  const handleFinalizeBookingAndInvoice = async (contactData) => {
    // First, create the bookings
    const createdBookings = await handleFinalizeBooking(contactData);

    // Only create an invoice immediately if the current user is the property owner.
    if (
      createdBookings &&
      createdBookings.length > 0 &&
      property &&
      currentUser &&
      property.owner_id === currentUser.id
    ) {
      const bookingIds = createdBookings.map((b) => b.id);
      console.log(
        "Property owner creating invoice for booking IDs:",
        bookingIds
      );

      try {
        const { data, error } = await supabase.functions.invoke(
          "create-invoice",
          {
            body: { bookingIds },
          }
        );

        if (error) throw error;

        console.log("Invoice created:", data);
        toast.success("Bookings created and invoice is being generated.");
      } catch (error) {
        setBookingError(`Failed to create invoice. ${error.message}`);
        console.error(error);
        toast.error(`Failed to create invoice: ${error.message}`);
      }
    }
  };

  const handleFinalizeBooking = async (contactData) => {
    if (!isAuthenticated) {
      const workflowData = {
        postcode,
        street,
        city,
        buildingType,
        propertyName: property ? property.name : propertyName,
        floors,
        size,
        tenants,
        additionalServices,
        dateTime,
        contactDetails: contactData,
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
      contactDetails: contactData,
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
        property?.owner_id === currentUser?.id ? "approved" : "pending";

      const creationPromises = servicesToBook.map((service) => {
        const bookingData = {
          property_id: propertyId,
          property_name: property ? property.name : propertyName,
          booked_time: bookingTimestamp,
          contact_details: contactData,
          type: service,
          building_type: buildingType,
          status,
        };

        // Add service-specific meta data
        if (service === "PAT Testing" && additionalServices.meta?.devices) {
          bookingData.meta = { devices: additionalServices.meta.devices };
        } else if (
          service === "Fire Door Inspection" &&
          additionalServices.meta?.doors
        ) {
          bookingData.meta = { doors: additionalServices.meta.doors };
        } else if (
          service === "Fire Risk Assessment" &&
          additionalServices.meta?.option
        ) {
          const selectedOption = additionalServices.meta.option;
          bookingData.meta = { fraMeta: selectedOption };
        }

        return createBooking(bookingData);
      });

      const createdBookings = await Promise.all(creationPromises);
      console.log("Bookings created:", createdBookings);
      setCurrentStep("complete");
      return createdBookings;
    } catch (error) {
      setBookingError("Failed to create booking(s). Please try again.");
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleBookAnother = () => {
    setPostcode("");
    setStreet("");
    setCity("");
    setCurrentStep("location");
    setBuildingType("");
    setPropertyName("");
    setFloors("");
    setSize("");
    setTenants("");
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
    }
    // else if (currentStep === "property-details") {
    //   setCurrentStep("location");
    // } else {
    //   setCurrentStep("location");
    // }
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
            buildingType={buildingType}
            propertyId={propertyId}
            currentStep={currentStep}
            onGoBack={handleGoBack}
            onBuildingTypeSubmit={handleBuildingTypeSubmit}
            onBuildingTypeUpdate={handleBuildingTypeUpdate}
            onAdditionalServicesSubmit={handleAdditionalServicesSubmit}
            onTimeAndDateSubmit={handleTimeAndDateSubmit}
            onTimeAndDateContinue={handleTimeAndDateContinue}
            onContactSubmit={handleContactSubmit}
            // onPaymentSubmit={handlePaymentSubmit}
            onFinalizeBooking={handleFinalizeBookingAndInvoice}
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
