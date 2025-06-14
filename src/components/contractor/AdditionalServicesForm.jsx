import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { useEffect } from "react";

const AdditionalServicesForm = ({ onSubmit, showServices, onContinue }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [otherService, setOtherService] = useState("");
  const [selectedBuildingCategory, setSelectedBuildingCategory] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const services = [
    "PAT Testing",
    "Emergency Light Testing",
    "Lift Inspection",
    "Gas Safety Certificate",
    "Fire Risk Assessment",
    "Smoke and Carbon Monoxide Testing",
    "",
    "Others",
  ];

  const buildingCategories = [
    "Block of flats",
    "HMO (House in Multiple Occupation)",
    "Care Home",
    "Construction Site",
    "Flat/Apartment",
    "Mixed Use (Residential with Commercial)",
    "Student Occupation",
    "Others",
  ];

  const handleServiceChange = (service) => {
    let newServices;
    if (selectedServices.includes(service)) {
      newServices = selectedServices.filter((s) => s !== service);
    } else {
      newServices = [...selectedServices, service];
    }
    setSelectedServices(newServices);
    handleSubmit(newServices, selectedBuildingCategory, additionalInfo);
  };

  const handleOtherServiceChange = (e) => {
    const value = e.target.value;
    setOtherService(value);
    if (selectedServices.includes("Others")) {
      const newServices = [
        ...selectedServices.filter((s) => s !== "Others"),
        `Others: ${value}`,
      ];
      handleSubmit(newServices, selectedBuildingCategory, additionalInfo);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedBuildingCategory(category);
    handleSubmit(selectedServices, category, additionalInfo);
  };

  const handleAdditionalInfoChange = (e) => {
    const value = e.target.value;
    setAdditionalInfo(value);
    handleSubmit(selectedServices, selectedBuildingCategory, value);
  };

  useEffect(() => {
    onSubmit({
      services: selectedServices,
      buildingCategory: selectedBuildingCategory,
      additionalInfo: additionalInfo,
    });
  }, [selectedServices, selectedBuildingCategory, additionalInfo, onSubmit]);

  const handleContinue = () => {
    if (selectedBuildingCategory) {
      onContinue();
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {!showServices ? (
        <div className="mb-8 border border-grey-outline rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-2">
            Select Building Category
          </h3>
          <p className="text-sm text-primary-grey mb-4">
            Choose the category that best describes your building.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {buildingCategories.map((category) => (
              <label
                key={category}
                className={`relative flex items-center border rounded-md p-4 cursor-pointer transition-all ${
                  selectedBuildingCategory === category
                    ? "border-primary-orange bg-red-50"
                    : "border-grey-outline"
                }`}
              >
                <input
                  type="radio"
                  name="buildingCategory"
                  value={category}
                  checked={selectedBuildingCategory === category}
                  onChange={() => handleCategoryChange(category)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    selectedBuildingCategory === category
                      ? "border-primary-orange"
                      : "border-grey-outline"
                  }`}
                >
                  {selectedBuildingCategory === category && (
                    <span className="w-3 h-3 rounded-full bg-primary-orange"></span>
                  )}
                </span>
                <span className="font-medium">{category}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Information
            </label>
            <textarea
              value={additionalInfo}
              onChange={handleAdditionalInfoChange}
              placeholder="Please provide any additional details about your building..."
              className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange min-h-[100px]"
            />
          </div>
          {selectedBuildingCategory && (
            <div className="mt-6">
              <button
                onClick={handleContinue}
                className="w-full bg-primary-orange text-white py-3 rounded-md font-medium hover:bg-[#e54a30] transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-8 border border-grey-outline rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-2">
            Do you need any additional Services?
          </h3>
          <p className="text-sm text-primary-grey mb-6">
            Enable plane backwards needle optimize synergy. Shelf-ware or hill
            want on land bandwagon opportunity great team. Stand existing skulls
            hammer winning unlock I loss.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <label
                key={service}
                className={`relative flex items-center border rounded-md p-4 cursor-pointer transition-all ${
                  selectedServices.includes(service)
                    ? "border-primary-orange bg-red-50"
                    : "border-grey-outline"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceChange(service)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    selectedServices.includes(service)
                      ? "border-primary-orange"
                      : "border-grey-outline"
                  }`}
                >
                  {selectedServices.includes(service) && (
                    <span className="w-3 h-3 rounded-full bg-primary-orange"></span>
                  )}
                </span>
                <span className="font-medium text-gray-700">{service}</span>
              </label>
            ))}
          </div>

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
                className="w-full p-4 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdditionalServicesForm;
