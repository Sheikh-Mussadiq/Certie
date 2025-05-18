import { Check } from "lucide-react"

const FilterMenu = ({ isOpen, onClose, onFilter, currentFilters }) => {
  const filterOptions = [
    {
      id: "propertyType",
      label: "Property Type",
      options: ["Commercial", "Residential", "Mixed-Use"],
    },
    {
      id: "complianceScore",
      label: "Compliance Score",
      options: ["Above 90%", "70-90%", "Below 70%"],
    },
    {
      id: "trainingScore",
      label: "Training Score",
      options: ["Above 90%", "70-90%", "Below 70%"],
    },
  ]

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-grey-outline z-50">
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
                    onFilter(filterGroup.id, option)
                    onClose()
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
      </div>
    </div>
  )
}

export default FilterMenu