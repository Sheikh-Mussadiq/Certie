import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  className = "",
  label = "",
  description = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === value) || null
  );
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const option = options.find((option) => option.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  const toggleSelect = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-primary-red ml-1">*</span>}
        </label>
      )}

      {description && (
        <p className="text-sm text-primary-grey mb-2">{description}</p>
      )}

      <div className="relative" ref={selectRef}>
        <motion.button
          type="button"
          onClick={toggleSelect}
          disabled={disabled}
          className={`
            w-full appearance-none bg-white border rounded-lg py-3 px-4 pr-10 text-left
            transition-all duration-200 ease-in-out
            ${
              disabled
                ? "border-grey-outline bg-grey-fill text-primary-grey cursor-not-allowed"
                : "border-grey-outline text-gray-700 cursor-pointer hover:border-primary-orange/50 focus:border-primary-orange"
            }
            ${
              isOpen
                ? "border-primary-orange ring-2 ring-primary-orange/20"
                : ""
            }
          `}
          whileHover={!disabled ? { scale: 1.01 } : {}}
          whileTap={!disabled ? { scale: 0.99 } : {}}
        >
          <span
            className={`block truncate ${
              selectedOption ? "text-gray-700" : "text-primary-grey"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <motion.div
            className="absolute right-3 top-4 transform -translate-y-1/2 pointer-events-none"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-full mt-1 bg-white border border-grey-outline rounded-lg shadow-card overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto">
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                       w-full px-4 py-3 text-left transition-all duration-150
                       hover:bg-grey-fill hover:text-primary-black
                       ${
                         selectedOption?.value === option.value
                           ? "bg-primary-orange/10 text-primary-orange border-l-4 border-primary-orange"
                           : "text-gray-700"
                       }
                       ${index === 0 ? "rounded-t-lg" : ""}
                       ${index === options.length - 1 ? "rounded-b-lg" : ""}
                     `}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{option.label}</span>
                      {selectedOption?.value === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Check className="h-4 w-4 text-primary-orange" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomSelect;
