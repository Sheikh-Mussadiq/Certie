import { motion } from "framer-motion";
import {
  Flame,
  Clock,
  MapPin,
  Building,
  Users,
  AlertTriangle,
} from "lucide-react";

const ServiceSummary = ({
  postcode,
  property,
  buildingType,
  additionalServices = null,
  dateTime,
  contactDetails,
  tenants = "04",
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-6 border border-grey-outline sticky top-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
          <Flame size={16} className="text-primary-orange" />
        </div>
        <h3 className="font-semibold">Fire Risk Assessment</h3>
      </div>
      <p className="text-sm text-primary-grey mb-4 text-center">
        {contactDetails ? "Booking in progress" : "Not booked"}
      </p>

      <hr className="my-4 border-grey-outline" />

      <div className="space-y-4">
        {property ? (
          <div className="flex items-start gap-3">
            <MapPin
              size={16}
              className="text-primary-orange flex-shrink-0 mt-1"
            />
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium">Property Address:</p>
              <p className="text-sm text-primary-grey">
                {property.address.city}, {property.address.postcode}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-primary-orange flex-shrink-0" />
            <div className="flex w-full">
              <p className="text-sm font-medium">Postcode:</p>
              <p className="text-sm ml-1 text-primary-grey">
                {postcode || "Not specified"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Building size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Property Type:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {property?.property_type
                ? property.property_type.charAt(0).toUpperCase() +
                  property.property_type.slice(1)
                : "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Time:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {dateTime
                ? `${dateTime.date?.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    weekday: "long",
                  })} - ${dateTime.time} (2 Hours)`
                : "Not scheduled yet"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Post Code:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {postcode || property?.address.postcode || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Address:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {property?.address.city || "Not specified yet"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">Building Type:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {additionalServices?.buildingCategory || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users size={16} className="text-primary-orange flex-shrink-0" />
          <div className="flex w-full">
            <p className="text-sm font-medium">No. of Tenants:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {buildingType?.tenants || tenants}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AlertTriangle
            size={16}
            className="text-primary-orange flex-shrink-0"
          />
          <div className="flex w-full">
            <p className="text-sm font-medium">Other assessments required:</p>
            <p className="text-sm ml-1 text-primary-grey">
              {additionalServices?.services &&
              additionalServices.services.length > 0
                ? additionalServices.services.join(", ")
                : "None selected"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceSummary;
