import React from "react";
import Shimmer from "../../ui/Shimmer";

const OutstandingIssuesShimmer = () => {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center mb-4">
        <Shimmer className="h-10 w-10 rounded-lg mr-2" />
        <Shimmer className="h-6 w-1/2" />
        <Shimmer className="h-6 w-8 rounded-full ml-2" />
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-2 rounded-lg bg-grey-fill/50 space-y-2">
            <div className="flex justify-between items-start">
              <Shimmer className="h-4 w-1/2" />
              <Shimmer className="h-5 w-20 rounded-md" />
            </div>
            <Shimmer className="h-3 w-3/4" />
            <Shimmer className="h-3 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutstandingIssuesShimmer;
