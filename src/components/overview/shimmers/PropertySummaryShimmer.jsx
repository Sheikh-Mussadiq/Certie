import React from "react";
import Shimmer from "../../ui/Shimmer";

const PropertySummaryShimmer = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <Shimmer className="rounded-lg w-full h-64" />
      </div>
      <div className="md:w-1/2 space-y-4">
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-1/2" />
        <Shimmer className="h-4 w-2/3" />
        <Shimmer className="h-4 w-3/4" />
        <div className="flex items-center pt-3">
          <Shimmer className="w-8 h-8 rounded-full mr-3" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySummaryShimmer;
