import React from 'react';
import Shimmer from '../../ui/Shimmer';

const LogbookTasksShimmer = () => {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full">
          <Shimmer className="h-10 w-10 rounded-lg mr-2" />
          <Shimmer className="h-6 w-1/2" />
          <Shimmer className="h-6 w-8 rounded-full ml-2" />
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-grey-fill/50">
            <div className="w-2/3 space-y-2">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
            <Shimmer className="h-5 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogbookTasksShimmer;
