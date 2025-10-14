import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { X, Building2, Search, Plus, MapPin, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPropertiesBasic } from "../../services/propertiesServices";
import { useAuth } from "../../context/AuthContext";
import Shimmer from "../ui/Shimmer";

const PropertySelectionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getPropertiesBasic();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties
    .filter(property => property.owner_id === currentUser?.id) // Filter by ownership
    .filter(property => 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.address && typeof property.address === 'object' &&
        (property.address.street?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         property.address.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         property.address.postcode?.toLowerCase().includes(searchQuery.toLowerCase())))
    );

  const handleAddPropertyClick = () => {
    onClose();
    navigate("/properties/add");
  };

  const handlePropertySelect = (propertyId) => {
    navigate("/contractor-workflow", {
      state: {
        propertyId: propertyId,
        startAtStep: 2,
      },
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">
                      Select Property
                    </Dialog.Title>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddPropertyClick}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-orange text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-orange/90 transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Add Property</span>
                        <span className="sm:hidden">Add</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="px-4 py-4 sm:px-6 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, address, or postcode..."
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 py-4 sm:px-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="border border-gray-200 rounded-xl p-4"
                        >
                          <Shimmer className="h-5 w-40 mb-2" />
                          <Shimmer className="h-4 w-56" />
                        </motion.div>
                      ))}
                    </div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-red-500"
                    >
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <X className="w-8 h-8" />
                      </div>
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  ) : filteredProperties.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                      >
                        <Home className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      </motion.div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        No properties found
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 max-w-sm px-4">
                        {searchQuery
                          ? "Try adjusting your search terms"
                          : "You don't have any properties yet. Add one to get started!"}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      <AnimatePresence mode="popLayout">
                        {filteredProperties.map((property, index) => (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-primary-orange hover:shadow-md cursor-pointer transition-all duration-200"
                            onClick={() => handlePropertySelect(property.id)}
                          >
                            <div className="flex items-start gap-3 sm:gap-4">
                              <motion.div
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-primary-orange transition-colors"
                              >
                                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-orange group-hover:text-white transition-colors" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 truncate group-hover:text-primary-orange transition-colors">
                                  {property.name}
                                </h3>
                                <div className="flex items-start gap-1.5 text-xs sm:text-sm text-gray-500">
                                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                                  <p className="line-clamp-2">
                                    {property.address
                                      ? typeof property.address === "string"
                                        ? property.address
                                        : `${property.address.street || ""}, ${
                                            property.address.city || ""
                                          }, ${property.address.postcode || ""}`
                                      : "No address available"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* Hover indicator */}
                            <motion.div
                              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              initial={{ x: -10 }}
                              whileHover={{ x: 0 }}
                            >
                              <div className="w-6 h-6 rounded-full bg-primary-orange flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PropertySelectionModal;
