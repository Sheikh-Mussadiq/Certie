import { Check } from "lucide-react"

const SortMenu = ({ isOpen, onClose, onSort, currentSort }) => {
  const sortOptions = [
    { id: "address", label: "Address" },
    { id: "complianceScore", label: "Compliance Score" },
    { id: "trainingScore", label: "Training Score" },
    { id: "responsiblePerson", label: "Responsible Person" },
  ]

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-grey-outline z-50">
      <div className="p-2">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              onSort(option.id)
              onClose()
            }}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-primary-black hover:bg-grey-fill rounded-md"
          >
            {option.label}
            {currentSort?.field === option.id && (
              <Check className="w-4 h-4 text-primary-orange" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SortMenu