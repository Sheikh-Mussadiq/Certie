import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CustomSelect from "../ui/CustomSelect";

const BuildingForm = ({ property, onDataChange, initialData }) => {
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
    { value: "Other", label: "Other" },
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
    }
  }, [property]);

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
    onDataChange,
  ]);

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
      <div className="mb-8">
        <CustomSelect
          value={buildingType}
          onChange={setBuildingType}
          options={property_types}
          placeholder="Select a building type"
          required
          label="Building Type"
          description="Enable plans buttondown rebuke nobistate synergy. Shelf-ware of hit want on land blindwhagon opportunity great team."
        />
      </div>

      <div className="mb-8">
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
      </div>
    </motion.div>
  );
};

export default BuildingForm;
