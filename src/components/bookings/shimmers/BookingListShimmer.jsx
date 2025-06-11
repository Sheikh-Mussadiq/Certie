import React from "react";
import Shimmer from "../../ui/Shimmer";

const BookingListShimmer = ({ rows = 10 }) => {
  return (
    <div className="bg-white rounded-lg border border-grey-outline overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-grey-fill">
          <tr>
            <th scope="col" className="px-6 py-3 w-12">
              <Shimmer className="h-4 w-4" />
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <Shimmer className="h-4 w-24" />
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <Shimmer className="h-4 w-32" />
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <Shimmer className="h-4 w-28" />
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <Shimmer className="h-4 w-20" />
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <Shimmer className="h-4 w-32" />
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-grey-outline">
          {Array.from({ length: rows }).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Shimmer className="h-4 w-4" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Shimmer className="h-5 w-40" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Shimmer className="h-5 w-32" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Shimmer className="h-5 w-28" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Shimmer className="h-5 w-24" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Shimmer className="h-8 w-8 rounded-full" />
                  <div className="ml-3">
                    <Shimmer className="h-5 w-28" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Shimmer className="h-5 w-5" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingListShimmer;
