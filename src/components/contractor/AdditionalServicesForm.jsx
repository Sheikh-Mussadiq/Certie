import { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check as CheckIcon, Phone } from "lucide-react";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import { getAllServices } from "../../services/serviceServices";
import { updatePropertyBuildingType } from "../../services/propertiesServices";
import { toast } from "react-hot-toast";
import fraPricingData from "../../assets/FRA_Pricing.json";

const AdditionalServicesForm = ({
  onSubmit,
  buildingCategory,
  property,
  onBuildingTypeUpdate,
}) => {
  // Allowed building types
  const allowedBuildingTypes = [
    "Residential Block",
    "Single Residential Dwelling",
    "Commercial Office",
    "Mixed-Use Building",
    "School / Education",
    "Retail Unit",
    "Warehouse / Industrial",
    "HMO (House in Multiple Occupation)",
    "Care Facility",
    "Hotel",
  ];

  const [selectedServices, setSelectedServices] = useState([]);
  const [otherService, setOtherService] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBuildingType, setCurrentBuildingType] = useState(
    buildingCategory || ""
  );
  const [isUpdatingBuildingType, setIsUpdatingBuildingType] = useState(false);
  const [quantities, setQuantities] = useState({
    devices: 100, // Default value for PAT Testing
    doors: 10, // Default value for Fire Door Inspection
    units: "", // Default value for Fire Risk Assessment
  });
  const [fraOption, setFraOption] = useState(""); // Fire Risk Assessment option
  const [fraNumericValue, setFraNumericValue] = useState(""); // For numeric inputs
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedPoaOption, setSelectedPoaOption] = useState(null);

  // Contact Modal Component
  const ContactModal = () => {
    return (
      <Dialog
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-orange" />
              Contact Us for Pricing
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              {selectedPoaOption?.label && (
                <p>
                  You've selected:{" "}
                  <span className="font-medium">{selectedPoaOption.label}</span>
                </p>
              )}
              <p className="mt-2">
                Due to the size and complexity of this option, we'd like to
                provide you with a customized quote. Please contact our sales
                team for detailed pricing information.
              </p>
            </Dialog.Description>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                onClick={() => setIsContactModalOpen(false)}
              >
                Close
              </button>
              <a
                href="mailto:sales@example.com"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-orange hover:bg-primary-orange/90 rounded-lg"
              >
                Contact Sales
              </a>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  };

  // Price calculation functions
  const calculatePatTestingPrice = (devices) => {
    const basePrice = 99; // £99 for 100 devices
    const additionalDevices = Math.max(0, devices - 100);
    const additionalCost = additionalDevices * 0.89; // 89p per additional device
    return basePrice + additionalCost;
  };

  const calculateFireDoorPrice = (doors) => {
    const basePrice = 180; // £180 for 10 doors
    const additionalDoors = Math.max(0, doors - 10);
    const additionalCost = additionalDoors * 15; // £15 per additional door
    return basePrice + additionalCost;
  };

  // Fire Risk Assessment helper functions
  const getFraBuildingType = () => {
    return fraPricingData.buildingTypes.find(
      (type) => type.id === currentBuildingType
    );
  };

  const getFraOptionById = (optionId) => {
    const buildingType = getFraBuildingType();
    if (!buildingType) return null;
    return buildingType.options.find((option) => option.id === optionId);
  };

  const findFraOptionByNumericValue = (value) => {
    const buildingType = getFraBuildingType();
    if (!buildingType || !value) return null;

    const numValue = parseInt(value);
    return buildingType.options.find((option) => {
      if (option.min !== undefined && option.max !== undefined) {
        return numValue >= option.min && numValue <= option.max;
      } else if (option.min !== undefined && option.max === null) {
        return numValue >= option.min;
      }
      return false;
    });
  };

  const getFraPrice = (option) => {
    if (!option) return null;
    if (option.poa) return "POA (please contact sales)";
    return `${fraPricingData.currencySymbol}${option.price}`;
  };

  // Handle building type update
  const handleBuildingTypeChange = async (newBuildingType) => {
    if (!property?.id || newBuildingType === currentBuildingType) return;

    setIsUpdatingBuildingType(true);
    try {
      await updatePropertyBuildingType(property.id, newBuildingType);
      setCurrentBuildingType(newBuildingType);

      // Clear FRA selection when building type changes as options may be different
      setFraOption("");
      setFraNumericValue("");

      // Notify parent component about the building type change
      if (onBuildingTypeUpdate) {
        onBuildingTypeUpdate(newBuildingType);
      }

      toast.success("Building type updated successfully");
    } catch (error) {
      console.error("Error updating building type:", error);
      toast.error("Failed to update building type");
    } finally {
      setIsUpdatingBuildingType(false);
    }
  };

  // Sync current building type with prop changes
  useEffect(() => {
    setCurrentBuildingType(buildingCategory || "");
  }, [buildingCategory]);

  useEffect(() => {
    if (!currentBuildingType) return;
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesData = await getAllServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [currentBuildingType]);

  const handleServiceChange = (serviceName) => {
    let newServices;
    if (selectedServices.includes(serviceName)) {
      newServices = selectedServices.filter((s) => s !== serviceName);
      // Clear related state when service is deselected
      if (serviceName === "Fire Risk Assessment") {
        setFraOption("");
        setFraNumericValue("");
      }
    } else {
      newServices = [...selectedServices, serviceName];
      // If Fire Risk Assessment is selected, set the default option
      if (serviceName === "Fire Risk Assessment") {
        const buildingType = getFraBuildingType();
        if (buildingType && buildingType.options) {
          const firstOption = buildingType.options.find((option) => !option.poa);
          if (firstOption) {
            setFraOption(firstOption.id);
          }
        }
      }
    }
    setSelectedServices(newServices);
  };

  const handleOtherServiceChange = (e) => {
    setOtherService(e.target.value);
  };

  const handleQuantityChange = (type, value) => {
    // Validate minimum values
    if (type === "devices" && value < 100) return;
    if (type === "doors" && value < 10) return;

    setQuantities((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleFraOptionChange = (optionId) => {
    setFraOption(optionId);
    setFraNumericValue(""); // Clear numeric input when selecting from dropdown
  };

  const handleFraNumericChange = (value) => {
    setFraNumericValue(value);
    setQuantities((prev) => ({ ...prev, units: value }));
    // Find matching option based on numeric value
    const matchingOption = findFraOptionByNumericValue(value);
    if (matchingOption) {
      setFraOption(matchingOption.id);
    }
  };

  useEffect(() => {
    let finalServices = [...selectedServices];
    const otherIndex = finalServices.indexOf("Others");
    if (otherIndex !== -1 && otherService) {
      finalServices[otherIndex] = `Others: ${otherService}`;
    }

    // Prepare meta data for booking
    const meta = {};
    if (selectedServices.includes("PAT Testing")) {
      meta.devices = quantities.devices;
    }
    if (selectedServices.includes("Fire Door Inspection")) {
      meta.doors = quantities.doors;
    }
    if (selectedServices.includes("Fire Risk Assessment")) {
      if (fraNumericValue) {
        meta.units = fraNumericValue;
      }
      if (!fraOption) {
        console.warn("Fire Risk Assessment selected but no option chosen");
      } else {
        const buildingTypeData = getFraBuildingType();
        if (!buildingTypeData) {
          console.warn(
            `No FRA pricing data found for building type: ${currentBuildingType}`
          );
          meta.fraError = `No pricing available for building type: ${currentBuildingType}`;
        } else {
          const selectedOption = getFraOptionById(fraOption);
          console.log("FRA Debug:", {
            fraOption,
            currentBuildingType,
            selectedOption,
            buildingTypeFound: buildingTypeData,
          });
          if (selectedOption) {
            meta.option = selectedOption;
          } else {
            console.warn("Selected option is null for fraOption:", fraOption);
            meta.fraError = "Selected option not found";
          }
        }
      }
    }

    onSubmit({
      services: finalServices,
      buildingCategory: currentBuildingType,
      meta: meta,
    });
  }, [
    selectedServices,
    otherService,
    quantities,
    fraOption,
    onSubmit,
    currentBuildingType,
  ]);

  if (loading) {
    return (
      <div className="w-full text-center">
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ContactModal />
      <div className="mb-8 border border-grey-outline rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-2">
          Choose which services you need
        </h3>
        <p className="text-sm text-primary-grey mb-6">
          Select the services you need from the list below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <label
              key={service.id}
              className={`relative flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-all ${
                selectedServices.includes(service.name)
                  ? "border-primary-orange bg-primary-orange/10"
                  : "border-grey-outline"
              }`}
            >
              <div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.name)}
                    onChange={() => handleServiceChange(service.name)}
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedServices.includes(service.name)
                        ? "border-primary-orange"
                        : "border-grey-outline"
                    }`}
                  >
                    {selectedServices.includes(service.name) && (
                      <span className="w-3 h-3 rounded-full bg-primary-orange"></span>
                    )}
                  </span>
                  <span
                    className={`font-medium ${
                      selectedServices.includes(service.name)
                        ? "text-primary-black"
                        : "text-primary-grey"
                    }`}
                  >
                    {service.name}
                  </span>
                </div>
              </div>
              {/* <span className="font-semibold text-primary-black">
                £{service.price_in_cents / 100}
              </span> */}
            </label>
          ))}
        </div>

        {/* Building Type Selector - Show only if property exists */}
        {property?.id && (
          <div className="mt-6 p-4 border border-grey-outline rounded-lg bg-grey-fill">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg text-primary-black">
                  Update Building Type
                </h4>
                <p className="text-sm text-primary-grey mt-1">
                  You can update your property's building type if it was
                  selected incorrectly.
                </p>
              </div>
            </div>
            <div className="relative">
              <Listbox
                value={currentBuildingType}
                onChange={handleBuildingTypeChange}
                disabled={isUpdatingBuildingType}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer bg-white py-3 pl-4 pr-10 text-left border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                    <span
                      className={`block truncate ${
                        !currentBuildingType && "text-gray-500"
                      }`}
                    >
                      {currentBuildingType || "Select a building type"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      {isUpdatingBuildingType ? (
                        <div className="animate-spin h-4 w-4 border-b-2 border-primary-orange mr-1"></div>
                      ) : (
                        <ChevronDown
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dropdown-scroll">
                      {currentBuildingType === "" && (
                        <div className="text-gray-500 py-2 pl-4 pr-4 select-none">
                          <span className="block truncate">
                            No building type selected
                          </span>
                        </div>
                      )}
                      {allowedBuildingTypes.map((type) => (
                        <Listbox.Option
                          key={type}
                          value={type}
                          className={({ active }) =>
                            `${
                              active
                                ? "bg-primary-orange/10 text-primary-orange rounded-md"
                                : "text-gray-700"
                            }
                            cursor-pointer select-none relative py-2 pl-4 pr-4`
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {type}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-orange">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        )}

        {/* Quantity inputs for specific services */}
        {selectedServices.includes("PAT Testing") && (
          <div className="mt-4 p-4 border border-grey-outline rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <label className="text-primary-black font-medium">
                Number of Devices (Minimum 100)
              </label>
              <div className="text-right">
                <div className="font-semibold text-primary-orange">
                  £{calculatePatTestingPrice(quantities.devices).toFixed(2)}
                </div>
                <div className="text-xs text-primary-grey">
                  £99 base + 89p per additional device
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="px-3 py-1 border border-grey-outline rounded-l-lg"
                onClick={() =>
                  handleQuantityChange(
                    "devices",
                    Math.max(100, quantities.devices - 1)
                  )
                }
              >
                -
              </button>
              <input
                type="number"
                value={quantities.devices}
                onChange={(e) =>
                  handleQuantityChange(
                    "devices",
                    parseInt(e.target.value) || 100
                  )
                }
                className="w-20 border-t border-b border-grey-outline text-center"
                min="100"
              />
              <button
                type="button"
                className="px-3 py-1 border border-grey-outline rounded-r-lg"
                onClick={() =>
                  handleQuantityChange("devices", quantities.devices + 1)
                }
              >
                +
              </button>
            </div>
          </div>
        )}

        {selectedServices.includes("Fire Door Inspection") && (
          <div className="mt-4 p-4 border border-grey-outline rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <label className="text-primary-black font-medium">
                Number of Doors (Minimum 10)
              </label>
              <div className="text-right">
                <div className="font-semibold text-primary-orange">
                  £{calculateFireDoorPrice(quantities.doors).toFixed(2)}
                </div>
                <div className="text-xs text-primary-grey">
                  £180 base (includes 10 doors) + £15 per additional door
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="px-3 py-1 border border-grey-outline rounded-l-lg"
                onClick={() =>
                  handleQuantityChange(
                    "doors",
                    Math.max(10, quantities.doors - 1)
                  )
                }
              >
                -
              </button>
              <input
                type="number"
                value={quantities.doors}
                onChange={(e) =>
                  handleQuantityChange("doors", parseInt(e.target.value) || 10)
                }
                className="w-20 border-t border-b border-grey-outline text-center"
                min="10"
              />
              <button
                type="button"
                className="px-3 py-1 border border-grey-outline rounded-r-lg"
                onClick={() =>
                  handleQuantityChange("doors", quantities.doors + 1)
                }
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Fire Risk Assessment inputs */}
        {selectedServices.includes("Fire Risk Assessment") && (
          <div className="mt-4 p-4 border border-grey-outline rounded-lg">
            {(() => {
              const buildingType = getFraBuildingType();
              if (!buildingType) {
                return (
                  <div className="text-center text-primary-grey">
                    Fire Risk Assessment not available for this building type
                  </div>
                );
              }

              const selectedOption = getFraOptionById(fraOption);
              const price = getFraPrice(selectedOption);

              return (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <label className="text-primary-black font-medium">
                      {buildingType.promptLabel}
                    </label>
                    {price && (
                      <div className="text-right">
                        <div className="font-semibold text-primary-orange">
                          Price: {price}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Show only ranges for now - numeric input commented out */}
                  {/* TODO: Uncomment below for numeric input functionality */}
                  {/* 
                  {buildingType.inputType === "units" || 
                   buildingType.inputType === "rooms" || 
                   buildingType.inputType === "size" || 
                   buildingType.inputType === "sqft" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Enter number of {buildingType.inputType}
                        </label>
                        <input
                          type="number"
                          value={fraNumericValue}
                          onChange={(e) => handleFraNumericChange(e.target.value)}
                          className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                          placeholder={`Enter number of ${buildingType.inputType}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Or select from ranges:
                        </label>
                        <div className="relative">
                          <select
                            value={fraOption}
                            onChange={(e) => handleFraOptionChange(e.target.value)}
                            className="w-full appearance-none bg-white border border-grey-outline rounded-lg py-3 px-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-primary-orange"
                          >
                            <option value="">Select a range</option>
                            {buildingType.options.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ( */}

                  {/* Show ranges as radio buttons for all input types */}
                  <div className="space-y-3">
                    {buildingType.options.map((option) => {
                      const isPoa = option.poa;

                      return (
                        <div
                          key={option.id}
                          className={`relative flex items-center justify-between border rounded-lg p-3 cursor-pointer transition-all ${
                            fraOption === option.id
                              ? "border-primary-orange bg-primary-orange/10"
                              : isPoa
                              ? "border-primary-orange/50 bg-primary-orange/5"
                              : "border-grey-outline"
                          }`}
                          onClick={() => {
                            if (isPoa) {
                              setSelectedPoaOption(option);
                              setIsContactModalOpen(true);
                            } else {
                              handleFraOptionChange(option.id);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            {!isPoa && (
                              <input
                                type="radio"
                                name="fraOption"
                                value={option.id}
                                checked={fraOption === option.id}
                                onChange={() =>
                                  handleFraOptionChange(option.id)
                                }
                                className="sr-only"
                              />
                            )}
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                fraOption === option.id
                                  ? "border-primary-orange"
                                  : isPoa
                                  ? "border-primary-orange/50"
                                  : "border-grey-outline"
                              }`}
                            >
                              {fraOption === option.id && !isPoa && (
                                <span className="w-3 h-3 rounded-full bg-primary-orange"></span>
                              )}
                              {isPoa && (
                                <Phone className="w-3 h-3 text-primary-orange/70" />
                              )}
                            </span>
                            <span
                              className={`font-medium ${
                                isPoa ? "text-primary-orange/90" : ""
                              }`}
                            >
                              {option.label}
                            </span>
                          </div>
                          <span
                            className={`font-semibold ${
                              isPoa
                                ? "text-primary-orange/90"
                                : "text-primary-orange"
                            }`}
                          >
                            {getFraPrice(option)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* )} */}
                </>
              );
            })()}
          </div>
        )}

        {selectedServices.includes("Others") && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Please Specify
            </label>
            <input
              type="text"
              value={otherService}
              onChange={handleOtherServiceChange}
              placeholder="Enter Text Here"
              className="w-full p-4 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdditionalServicesForm;
