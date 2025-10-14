import React, { useState, useRef, useEffect } from "react";
import {
  SlidersHorizontal,
  Search,
  ChevronDown,
  LayoutList,
  Check,
  ArrowUpDown,
} from "lucide-react";
import Sort from "../../assets/sort-a-z.png";
import Filter from "../../assets/filter.png";

const BookingFilters = ({
  onSearch,
  onSortChange,
  onFilterChange,
  onViewChange,
  sortOption,
  filterStatus,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  const sortOptions = {
    created_at_desc: "Creation Date (Newest)",
    created_at_asc: "Creation Date (Oldest)",
    booked_time_desc: "Booking Date (Newest)",
    booked_time_asc: "Booking Date (Oldest)",
    property_name_asc: "Property Name (A-Z)",
    property_name_desc: "Property Name (Z-A)",
    status: "Status",
  };

  const filterOptions = {
    all: "All Statuses",
    assigned: "Assigned",
    approved: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const handleSortClick = () => {
    setIsSortOpen(!isSortOpen);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSortSelect = (option) => {
    onSortChange(option);
    setIsSortOpen(false);
  };

  const handleFilterSelect = (option) => {
    onFilterChange(option);
    setIsFilterOpen(false);
  };

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeFilterCount = filterStatus === "all" ? 0 : 1;

  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative inline-block" ref={sortRef}>
          <button
            onClick={handleSortClick}
            className={`flex items-center justify-center gap-2 text-sm border border-grey-outline rounded-lg p-2 md:px-4 shadow-sm transition-colors ${
              sortOption && sortOption !== "created_at_desc"
                ? "text-primary-orange bg-orange-50"
                : "text-primary-black hover:text-primary-orange hover:bg-orange-50"
            }`}
            title="Sort by"
            aria-label="Sort by"
          >
            <img src={Sort} alt="sort" className="w-5 h-5" />
            <span className="hidden md:inline">Sort by</span>
          </button>
          {isSortOpen && (
            <div className="absolute z-10 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="p-2">
                {Object.entries(sortOptions).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleSortSelect(key)}
                    className={`flex w-full items-center justify-between my-1 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 ${
                      sortOption === key ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    <span>{value}</span>
                    {sortOption === key && (
                      <Check className="h-4 w-4 text-primary-orange" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative inline-block" ref={filterRef}>
          <button
            onClick={handleFilterClick}
            className={`flex items-center justify-center gap-2 text-sm border border-grey-outline rounded-lg p-2 md:px-4 shadow-sm transition-colors relative ${
              activeFilterCount > 0
                ? "text-primary-orange bg-orange-50"
                : "text-primary-black hover:text-primary-orange hover:bg-orange-50"
            }`}
            title="Filter"
            aria-label="Filter"
          >
            <img src={Filter} alt="filter" className="w-5 h-5" />
            <span className="hidden md:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 md:relative md:top-0 md:right-0 inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 text-xs font-medium bg-primary-orange text-white rounded-full md:ml-1">
                {activeFilterCount}
              </span>
            )}
          </button>
          {isFilterOpen && (
            <div className="absolute left-0 md:right-0 z-10 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="p-2">
                {Object.entries(filterOptions).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleFilterSelect(key)}
                    className={`flex w-full items-center justify-between rounded-lg my-1 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      filterStatus === key ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    <span>{value}</span>
                    {filterStatus === key && (
                      <Check className="h-4 w-4 text-primary-orange" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* <div className="relative inline-block">
          <button
            onClick={onViewChange}
            className="flex items-center justify-center text-sm border border-grey-outline rounded-lg p-2 shadow-sm transition-colors text-primary-black hover:text-primary-orange hover:bg-orange-50"
            title="List view"
            aria-label="List view"
          >
            <LayoutList className="w-5 h-5" />
          </button>
        </div> */}
      </div>

      <div className="relative flex-shrink-0">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border border-grey-outline rounded-lg text-sm focus:outline-none focus:border-primary-orange w-32 sm:w-48 md:w-64"
        />
      </div>
    </div>
  );
};

export default BookingFilters;
