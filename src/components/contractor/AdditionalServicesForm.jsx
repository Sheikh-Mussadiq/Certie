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

  useEffect(() => {
    if (!buildingCategory) return;
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesData = await getAllServices(buildingCategory);
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

  useEffect(() => {
    let finalServices = [...selectedServices];
    const otherIndex = finalServices.indexOf("Others");
    if (otherIndex !== -1 && otherService) {
      finalServices[otherIndex] = `Others: ${otherService}`;
    }

    onSubmit({
      services: finalServices,
      buildingCategory: buildingCategory,
    });
  }, [selectedServices, otherService, onSubmit, buildingCategory]);

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
              <span className="font-semibold text-primary-black">
                £{service.price_in_cents / 100}
              </span>
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
              className="w-full p-4 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdditionalServicesForm;
