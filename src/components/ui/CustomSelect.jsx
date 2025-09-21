import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
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
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === value) || null
  );

  useEffect(() => {
    const option = options.find((option) => option.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  const handleChange = (optionValue) => {
    const selectedOpt = options.find((opt) => opt.value === optionValue);
    if (selectedOpt) {
      onChange(selectedOpt.value);
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

      <div className="relative">
        <Listbox value={value} onChange={handleChange} disabled={disabled}>
          <div className="relative">
            <Listbox.Button
              className={`relative w-full cursor-pointer bg-white h-11 pl-4 pr-10 text-left text-sm font-medium border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 ${
                disabled
                  ? "disabled:opacity-50 disabled:cursor-not-allowed bg-grey-fill text-primary-grey"
                  : ""
              } shadow-sm flex items-center`}
            >
              <span
                className={`block truncate max-w-full ${
                  !selectedOption && "text-primary-grey"
                }`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                {disabled ? (
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
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 min-w-[200px] w-auto overflow-auto rounded-lg bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dropdown-scroll">
                {options.length === 0 ? (
                  <div className="text-gray-500 py-2 pl-4 pr-4 select-none">
                    <span className="block truncate">No options available</span>
                  </div>
                ) : (
                  options.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `${
                          active
                            ? "bg-primary-orange/10 text-primary-orange rounded-md"
                            : "text-gray-700"
                        }
                        cursor-pointer select-none relative py-2 pl-4 pr-10`
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {option.label}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-orange">
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default CustomSelect;
