import { Search, SlidersHorizontal, List, ArrowUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SortMenu from "./SortMenu";
import FilterMenu from "./FilterMenu";

const TableHeader = ({
  onSearch,
  onSort,
  onFilter,
  onViewChange,
  viewMode,
  currentSort,
  currentFilters,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center p-4 border-b border-grey-outline">
      <div className="flex items-center gap-4">
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className={`flex items-center gap-2 text-sm ${
              currentSort
                ? "text-primary-orange"
                : "text-primary-black hover:text-primary-orange"
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort by
          </button>
          <SortMenu
            isOpen={isSortOpen}
            onClose={() => setIsSortOpen(false)}
            onSort={onSort}
            currentSort={currentSort}
          />
        </div>
        <div ref={filterRef} className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 text-sm ${
              currentFilters
                ? "text-primary-orange"
                : "text-primary-black hover:text-primary-orange"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <FilterMenu
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilter={onFilter}
            currentFilters={currentFilters}
          />
        </div>
        <button
          onClick={() => onViewChange(viewMode === "table" ? "list" : "table")}
          className={`flex items-center gap-2 text-sm transition-colors ${
            viewMode === "list"
              ? "text-primary-orange"
              : "text-primary-black hover:text-primary-orange"
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
  );
};

export default TableHeader;
