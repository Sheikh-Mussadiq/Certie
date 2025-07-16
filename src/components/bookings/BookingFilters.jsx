import React, { useState, useRef, useEffect } from "react";
import {
  SlidersHorizontal,
  Search,
  ChevronDown,
  LayoutList,
  Check,
} from "lucide-react";

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
    <div className="flex flex-wrap justify-end items-center mb-6 gap-4">
      <div className="flex space-x-4">
        {/* <div className="relative inline-block" ref={sortRef}>
          <button
            onClick={handleSortClick}
            className="inline-flex text-sm items-center px-4 py-2 border border-grey-outline rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            <span>Sort by</span>
            <ChevronDown className="w-5 h-5 ml-2" />
          </button>
          {isSortOpen && (
            <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {Object.entries(sortOptions).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleSortSelect(key)}
                    className={`flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
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
        </div> */}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings"
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-grey-outline rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
          />
        </div>

        <div className="relative inline-block" ref={filterRef}>
          <button
            onClick={handleFilterClick}
            className="inline-flex text-sm items-center px-4 py-2 border border-grey-outline rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-orange text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className="w-5 h-5 ml-2" />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
            className="inline-flex text-sm items-center px-4 py-2 border border-grey-outline rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <LayoutList className="w-5 h-5 mr-2" />
            List view
            <ChevronDown className="w-5 h-5 ml-2" />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default BookingFilters;
