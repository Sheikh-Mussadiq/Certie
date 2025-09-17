import React, { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  MapPin,
  Building,
  Phone,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import "../../carousel.css";

const InfoLine = ({ icon: Icon, text }) => {
  // Split the text at the colon to separate label and value
  const parts = text.split(": ");

  // If there's a colon in the text, use the parts, otherwise use the whole text as value
  const [label, value] =
    parts.length > 1 ? [parts[0] + ":", parts.slice(1).join(": ")] : ["", text];

  return (
    <div className="flex items-start text-sm">
      <Icon className="w-4 h-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
      <div>
        <span className="text-gray-700">{label} </span>
        <span className="font-semibold">{value}</span>
      </div>
    </div>
  );
};

const PropertySummary = ({ properties }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Check if navigation should be shown (only when there are multiple properties)
  const showNavigation = properties && properties.length > 1;

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Update current index when slide changes
  const updateCurrentIndex = useCallback(() => {
    if (emblaApi) {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  // Set up event listeners
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", updateCurrentIndex);
    emblaApi.on("init", updateCurrentIndex);

    return () => {
      emblaApi.off("select", updateCurrentIndex);
      emblaApi.off("init", updateCurrentIndex);
    };
  }, [emblaApi, updateCurrentIndex]);

  // Function to get limited pills to show
  const getLimitedPills = useCallback(() => {
    const maxPills = 7; // Maximum number of pills to show
    const totalProperties = properties.length;

    if (totalProperties <= maxPills) {
      // Show all pills if within limit
      return Array.from({ length: totalProperties }, (_, i) => i);
    }

    // Calculate start and end indices to center around current index
    const half = Math.floor(maxPills / 2);
    let start = Math.max(0, currentIndex - half);
    let end = Math.min(totalProperties - 1, start + maxPills - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxPills) {
      start = Math.max(0, end - maxPills + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [properties.length, currentIndex]);

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500">No property data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm relative">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {properties.map((property) => {
            return (
              <div
                className="embla__slide flex flex-col md:flex-row gap-6"
                key={property.id}
              >
                <div className="md:w-1/2 h-64">
                  {property?.image ? (
                    <img
                      src={property.image}
                      alt={property?.name}
                      className="rounded-xl object-cover w-full h-full"
                    />
                  ) : (
                    <div className="rounded-xl bg-gray-100 w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <Building className="w-16 h-16 text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-600">
                        {property?.name || "Property"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        No image available for this property yet.
                      </p>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 space-y-3 flex flex-col justify-center">
                  <InfoLine
                    icon={MapPin}
                    text={`Property Name: ${property?.name || "N/A"}`}
                  />
                  <InfoLine
                    icon={MapPin}
                    text={`Address: ${
                      property?.address
                        ? `${property?.address?.street || ""}, ${
                            property?.address?.city || ""
                          }, ${property?.address?.postcode || ""}`
                        : "N/A"
                    }`}
                  />
                  <InfoLine
                    icon={Building}
                    text={`Property Type: ${property?.property_type || "N/A"}`}
                  />
                  <InfoLine
                    icon={MapPin}
                    text={`Contact Phone: ${property?.contact_phone || "N/A"}`}
                  />
                  <InfoLine
                    icon={Phone}
                    text={`Emergency Contact: ${property?.email || "N/A"}`}
                  />

                  {/* Show owner information if available */}
                  {property?.owner_data && (
                    <div className="flex items-center pt-3 bg-grey-fill/50 p-3 rounded-lg">
                      <img
                        src={
                          property.owner_data?.avatar_url ||
                          `https://i.pravatar.cc/40?u=${property.owner_data?.id}`
                        }
                        alt={property.owner_data?.full_name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div className="text-sm">
                        <p className="font-semibold">
                          {property.owner_data?.full_name}
                        </p>
                      </div>
                      <span className="ml-auto text-xs bg-gray-100 text-secondary-black px-3 py-1 rounded-md">
                        Property Owner
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showNavigation && (
        <div className="embla__buttons">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="embla__button"
            onClick={scrollPrev}
          >
            <ChevronLeft size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="embla__button"
            onClick={scrollNext}
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>
      )}

      {/* Interactive pills with simple limiting */}
      {showNavigation && (
        <div className="flex justify-center mt-4 space-x-2">
          {getLimitedPills().map((index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                index === currentIndex ? "bg-primary-orange" : "bg-gray-300"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              animate={{
                width: index === currentIndex ? 24 : 8,
                backgroundColor: index === currentIndex ? "#ff5436" : "#D1D5DB",
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.2,
                backgroundColor: index === currentIndex ? "#ff5436" : "#9CA3AF",
              }}
              whileTap={{
                scale: 0.9,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertySummary;
