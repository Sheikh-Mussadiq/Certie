import { Check, X } from "lucide-react";

const FilterMenu = ({ isOpen, onClose, onFilter, currentFilters }) => {
  const filterOptions = [
    {
      id: "property_type",
      label: "Property Type",
      options: [
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
        "Other",
      ],
    },
    {
      id: "complianceScore",
      label: "Compliance Score",
      options: ["Above 90%", "70-90%", "Below 70%"],
    },
    // {
    //   id: "trainingScore",
    //   label: "Training Score",
    //   options: ["Above 90%", "70-90%", "Below 70%"],
    // },
  ];

  const hasActiveFilters =
    currentFilters && Object.keys(currentFilters).length > 0;

  if (!isOpen) return null;

  const handleClearFilters = () => {
    filterOptions.forEach((group) => {
      group.options.forEach((option) => {
        if (currentFilters?.[group.id] === option) {
          onFilter(group.id, option); // This will toggle off the filter
        }
      });
    });
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-grey-outline z-50 max-h-[300px] overflow-y-auto">
      <div className="p-2 space-y-4">
        {filterOptions.map((filterGroup) => (
          <div key={filterGroup.id}>
            <h3 className="px-4 py-2 text-sm font-medium text-primary-black">
              {filterGroup.label}
            </h3>
            <div className="space-y-1">
              {filterGroup.options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onFilter(filterGroup.id, option);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-primary-black hover:bg-grey-fill rounded-md"
                >
                  {option}
                  {currentFilters?.[filterGroup.id] === option && (
                    <Check className="w-4 h-4 text-primary-orange" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {hasActiveFilters && (
          <div className="pt-2 border-t border-grey-outline">
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <X size={16} />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterMenu;
