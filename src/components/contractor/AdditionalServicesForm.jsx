import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { getAllServices } from "../../services/serviceServices";
import { toast } from "react-hot-toast";

const AdditionalServicesForm = ({ onSubmit, buildingCategory }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [otherService, setOtherService] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({
    devices: 100, // Default value for PAT Testing
    doors: 10,    // Default value for Fire Door Inspection
  });
  
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

  useEffect(() => {
    if (!buildingCategory) return;
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
  }, [buildingCategory]);

  const handleServiceChange = (serviceName) => {
    let newServices;
    if (selectedServices.includes(serviceName)) {
      newServices = selectedServices.filter((s) => s !== serviceName);
    } else {
      newServices = [...selectedServices, serviceName];
    }
    setSelectedServices(newServices);
  };

  const handleOtherServiceChange = (e) => {
    setOtherService(e.target.value);
  };

  const handleQuantityChange = (type, value) => {
    // Validate minimum values
    if (type === 'devices' && value < 100) return;
    if (type === 'doors' && value < 10) return;
    
    setQuantities(prev => ({
      ...prev,
      [type]: value
    }));
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

    onSubmit({
      services: finalServices,
      buildingCategory: buildingCategory,
      meta: meta
    });
  }, [selectedServices, otherService, quantities, onSubmit, buildingCategory]);

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
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 inline-block ${
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

        {/* Quantity inputs for specific services */}
        {selectedServices.includes("PAT Testing") && (
          <div className="mt-4 p-4 border border-grey-outline rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <label className="text-primary-black font-medium">Number of Devices (Minimum 100)</label>
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
                onClick={() => handleQuantityChange('devices', Math.max(100, quantities.devices - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantities.devices} 
                onChange={(e) => handleQuantityChange('devices', parseInt(e.target.value) || 100)}
                className="w-20 border-t border-b border-grey-outline text-center"
                min="100"
              />
              <button 
                type="button" 
                className="px-3 py-1 border border-grey-outline rounded-r-lg"
                onClick={() => handleQuantityChange('devices', quantities.devices + 1)}
              >
                +
              </button>
            </div>
          </div>
        )}

        {selectedServices.includes("Fire Door Inspection") && (
          <div className="mt-4 p-4 border border-grey-outline rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <label className="text-primary-black font-medium">Number of Doors (Minimum 10)</label>
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
                onClick={() => handleQuantityChange('doors', Math.max(10, quantities.doors - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantities.doors} 
                onChange={(e) => handleQuantityChange('doors', parseInt(e.target.value) || 10)}
                className="w-20 border-t border-b border-grey-outline text-center"
                min="10"
              />
              <button 
                type="button" 
                className="px-3 py-1 border border-grey-outline rounded-r-lg"
                onClick={() => handleQuantityChange('doors', quantities.doors + 1)}
              >
                +
              </button>
            </div>
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
