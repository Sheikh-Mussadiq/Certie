import React, { useCallback } from "react";
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
  const parts = text.split(': ');
  
  // If there's a colon in the text, use the parts, otherwise use the whole text as value
  const [label, value] = parts.length > 1 
    ? [parts[0] + ':', parts.slice(1).join(': ')] 
    : ['', text];
    
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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
                    text={`Property Name: ${property?.name || 'N/A'}`}
                  />
                  <InfoLine
                    icon={MapPin}
                    text={`Address: ${property?.address ? `${property?.address?.street || ''}, ${property?.address?.city || ''}, ${property?.address?.postcode || ''}` : 'N/A'}`}
                  />
                  <InfoLine
                    icon={Building}
                    text={`Property Type: ${property?.property_type || 'N/A'}`}
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
                    <div className="flex items-center pt-3">
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
    </div>
  );
};

export default PropertySummary;
