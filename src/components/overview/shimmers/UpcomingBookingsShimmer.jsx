import React from 'react';
import Shimmer from '../../ui/Shimmer';

const UpcomingBookingsShimmer = () => {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <Shimmer className="h-6 w-1/3" />
        <Shimmer className="h-8 w-24" />
      </div>
      <div className="space-y-4">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex items-center p-3 rounded-lg bg-grey-fill/50">
            <Shimmer className="h-10 w-10 rounded-lg mr-4" />
            <div className="flex-grow space-y-2">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
            <Shimmer className="h-6 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingBookingsShimmer;
