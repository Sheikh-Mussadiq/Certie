import { motion } from "framer-motion";
import { Clock, MapPin, Building, Users } from "lucide-react";
import { HiWrenchScrewdriver } from "react-icons/hi2";

const ServiceSummary = ({
  postcode,
  property,
  floors,
  size,
  tenants,
  address,
  buildingType,
  additionalServices = null,
  dateTime,
  contactDetails,
}) => {
  // Get all services to display at the top
  const selectedServices = additionalServices?.services || [];

  return (
    <motion.div
      className="bg-white rounded-xl p-6 border border-grey-outline sticky top-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="mb-2">
        <div className="flex gap-3 mb-1">
          <div className="w-8 h-8 bg-primary-orange/10 rounded flex items-center justify-center flex-shrink-0">
            <HiWrenchScrewdriver size={16} className="text-primary-orange" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold break-words">
              {selectedServices.length > 0
                ? selectedServices.join(", ")
                : "Assessment"}
            </h3>
          </div>
        </div>
      </div>

      <p className="text-sm text-primary-grey mb-4 text-center">
        {contactDetails ? "Booking in progress" : "Not booked"}
      </p>

      <hr className="my-4 border-grey-outline" />

      <div className="space-y-4">
        {property && property.address ? (
          <div className="flex items-start gap-3">
            <MapPin
              size={16}
              className="text-primary-orange flex-shrink-0 mt-1"
            />
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium">Property Address: </p>
              <p className="text-sm text-primary-grey">
                {property.address.street}, {property.address.city}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-primary-orange flex-shrink-0" />
            <div className="flex w-full">
              <p className="text-sm font-medium">Postcode:</p>
              <p className="text-sm ml-1 text-primary-grey">
                {postcode || property?.address.postcode || "Not specified"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Building size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Property Type:</p>
            <p className="text-sm ml-1 text-primary-grey">
            {buildingType ? buildingType : property?.type ? property.type : "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Date:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {dateTime
                ? `${dateTime.date?.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    weekday: "long",
                  })}`
                : "Not scheduled yet"}
            </p>
          </div>
        </div>
{/* 
        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Post Code:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {postcode || property?.address.postcode || "Not specified"}
            </p>
          </div>
        </div> */}

         {!property?.address && <div className="flex items-center gap-3">
          <Building size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Address:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {address || `${property?.address.street}, ${property?.address.city}` || "Not specified yet"}
            </p>
          </div>
        </div>}

        {/* <div className="flex items-center gap-3">
          <Building size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Building Type:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {additionalServices?.buildingCategory || "Not specified"}
            </p>
          </div>
        </div> */}

        <div className="flex items-center gap-3">
          <Users size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">No. of Occupants:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {tenants || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceSummary;
