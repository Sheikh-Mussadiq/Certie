import React from "react";
import {
  SlidersHorizontal,
  Search,
  ChevronDown,
  LayoutList,
} from "lucide-react";

const BookingFilters = ({ onSearch, onSort, onFilter, onViewChange }) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex space-x-4">
        <div className="relative inline-block">
          <button
            onClick={onSort}
            className="inline-flex items-center px-4 py-2 border border-grey-outline rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Sort by
            <ChevronDown className="w-5 h-5 ml-2" />
          </button>
        </div>

        <div className="relative inline-block">
          <button
            onClick={onFilter}
            className="inline-flex items-center px-4 py-2 border border-grey-outline rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filter
          </button>
        </div>

        <div className="relative inline-block">
          <button
            onClick={onViewChange}
            className="inline-flex items-center px-4 py-2 border border-grey-outline rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <LayoutList className="w-5 h-5 mr-2" />
            List view
            <ChevronDown className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

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
    </div>
  );
};

export default BookingFilters;
