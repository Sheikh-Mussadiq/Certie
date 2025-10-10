import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CustomSelect from "../ui/CustomSelect";
import PropertyMap from "../ui/PropertyMap";
import { updatePropertyBuildingType } from "../../services/propertiesServices";
import { toast } from "react-hot-toast";

const BuildingForm = ({
  property,
  onDataChange,
  initialData,
  onBuildingTypeUpdate,
}) => {
  const [buildingType, setBuildingType] = useState(
    initialData?.buildingType || ""
  );
  const [propertyName, setPropertyName] = useState(
    initialData?.propertyName || ""
  );
  const [street, setStreet] = useState(initialData?.street || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [postcode, setPostcode] = useState(initialData?.postcode || "");
  const [floors, setFloors] = useState(initialData?.floors || "");
  const [size, setSize] = useState(initialData?.size || "");
  const [tenants, setTenants] = useState(initialData?.tenants || "");
  const [isUpdatingBuildingType, setIsUpdatingBuildingType] = useState(false);
  const [latitude, setLatitude] = useState(
    initialData?.latitude || property?.latitude || 51.5072
  );
  const [longitude, setLongitude] = useState(
    initialData?.longitude || property?.longitude || -0.1276
  );

  const property_types = [
    { value: "Residential Block", label: "Residential Block" },
    {
      value: "Single Residential Dwelling",
      label: "Single Residential Dwelling",
    },
    { value: "Commercial Office", label: "Commercial Office" },
    { value: "Mixed-Use Building", label: "Mixed-Use Building" },
    { value: "School / Education", label: "School / Education" },
    { value: "Retail Unit", label: "Retail Unit" },
    { value: "Warehouse / Industrial", label: "Warehouse / Industrial" },
    {
      value: "HMO (House in Multiple Occupation)",
      label: "HMO (House in Multiple Occupation)",
    },
    { value: "Care Facility", label: "Care Facility" },
    { value: "Hotel", label: "Hotel" },
  ];

  useEffect(() => {
    if (property) {
      setBuildingType(property.property_type || "");
      setStreet(property.address?.street || "");
      setCity(property.address?.city || "");
      setPostcode(property.address?.postcode || "");
      setFloors(property.floors || "");
      setSize(property.square_ft || "");
      setTenants(property.occupants || "");
      if (property.latitude && property.longitude) {
        setLatitude(property.latitude);
        setLongitude(property.longitude);
      }
    }
  }, [property]);

  const handleBuildingTypeChange = async (newBuildingType) => {
    setBuildingType(newBuildingType);

    // If property exists, update it in the database
    if (property?.id && newBuildingType !== property.property_type) {
      setIsUpdatingBuildingType(true);
      try {
        await updatePropertyBuildingType(property.id, newBuildingType);

        // Notify parent component about the building type change
        if (onBuildingTypeUpdate) {
          onBuildingTypeUpdate(newBuildingType);
        }

        toast.success("Building type updated successfully");
      } catch (error) {
        console.error("Error updating building type:", error);
        toast.error("Failed to update building type");
        // Revert the change on error
        setBuildingType(property.property_type || "");
      } finally {
        setIsUpdatingBuildingType(false);
      }
    }
  };

  useEffect(() => {
    onDataChange({
      buildingType,
      propertyName,
      street,
      city,
      postcode,
      floors,
      size,
      tenants,
      latitude,
      longitude,
    });
  }, [
    buildingType,
    propertyName,
    street,
    city,
    postcode,
    floors,
    size,
    tenants,
    latitude,
    longitude,
    onDataChange,
  ]);

  const handleLocationChange = ({ lat, lng, address }) => {
    setLatitude(lat);
    setLongitude(lng);

    if (address) {
      if (address.road) setStreet(address.road);
      if (address.city || address.town || address.village) {
        setCity(address.city || address.town || address.village);
      }
      if (address.postcode) setPostcode(address.postcode);
      if (address.house_number && !propertyName) {
        setPropertyName(`${address.house_number} ${address.road || ""}`.trim());
      }
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {!property && (
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-2">Property Name</h3>
          <p className="text-sm text-primary-grey mb-4">
            Please provide a name for this new property.
          </p>
          <input
            type="text"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            className="w-full appearance-none bg-white border border-grey-outline rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
            placeholder="e.g., The Grand Building"
            required
          />
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-2">Property Address</h3>
        <p className="text-sm text-primary-grey mb-4">
          Enter the complete address for this property.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full appearance-none bg-white border border-grey-outline rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
              placeholder="e.g., 123 Main Street"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none bg-white border border-grey-outline rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
                placeholder="e.g., London"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode
              </label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full appearance-none bg-white border border-grey-outline rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
                placeholder="e.g., SW1A 1AA"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <h3 className="font-bold text-lg mb-2">Pin the Property Location</h3>
        <p className="text-sm text-primary-grey mb-4">
          Drag the marker or search within the map to fine-tune the exact
          location of your property in Greater London.
        </p>
        <PropertyMap
          coordinates={[latitude, longitude]}
          onLocationChange={handleLocationChange}
          height="360px"
        />
      </div>
      <div className="mb-8">
        <CustomSelect
          value={buildingType}
          onChange={handleBuildingTypeChange}
          options={property_types}
          placeholder="Select a building type"
          required
          label="Building Type"
          description="Select the type of building for your property. This affects available services and pricing."
          disabled={isUpdatingBuildingType}
        />
        {isUpdatingBuildingType && (
          <div className="mt-2 flex items-center text-sm text-primary-orange">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-orange mr-2"></div>
            Updating building type...
          </div>
        )}
      </div>

      {/* <div className="mb-8">
        <h3 className="font-bold text-lg mb-2">How many floors do you have?</h3>
        <p className="text-sm text-primary-grey mb-4">
          This helps determine the time needed and helps us to assign the right
          assessor for your building.
        </p>

        <input
          type="number"
          value={floors}
          onChange={(e) => setFloors(e.target.value)}
          className="w-full appearance-none bg-white border border-grey-outline rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
          placeholder="Enter number of floors"
          min="1"
          max="200"
        />
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-2">
          What's the Approx Sq Ft of the Building?
        </h3>
        <p className="text-sm text-primary-grey mb-4">
          Enter the approximate square footage of your building.
        </p>

        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full appearance-none bg-white border border-grey-outline rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
          placeholder="Enter square footage (e.g., 2500)"
          min="1"
          max="1000000"
        />
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-2">How many Tenants do you have</h3>
        <p className="text-sm text-primary-grey mb-4">
          Enter the number of tenants or occupants in your building.
        </p>

        <input
          type="number"
          value={tenants}
          onChange={(e) => setTenants(e.target.value)}
          className="w-full appearance-none bg-white border border-grey-outline rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:border-primary-orange"
          placeholder="Enter number of tenants (e.g., 25)"
          min="0"
          max="10000"
        />
      </div> */}
    </motion.div>
  );
};

export default BuildingForm;
