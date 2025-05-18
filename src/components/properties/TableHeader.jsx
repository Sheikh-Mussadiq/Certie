import { Search, SlidersHorizontal, List, ArrowUpDown } from "lucide-react"

const TableHeader = ({ onSearch, onSort, onFilter, onViewChange, viewMode }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-grey-outline">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-primary-black hover:text-primary-orange">
          <ArrowUpDown className="w-4 h-4" />
          Sort by
        </button>
        <button className="flex items-center gap-2 text-sm text-primary-black hover:text-primary-orange">
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
        <button 
          onClick={() => onViewChange(viewMode === "table" ? "list" : "table")}
          className={`flex items-center gap-2 text-sm transition-colors ${
            viewMode === "list" ? "text-primary-orange" : "text-primary-black hover:text-primary-orange"
          }`}
        >
          <List className="w-4 h-4" />
          List view
        </button>
      </div>
      
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search properties..."
          className="pl-10 pr-4 py-2 border border-grey-outline rounded-lg text-sm focus:outline-none focus:border-primary-orange"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  )
}

export default TableHeader