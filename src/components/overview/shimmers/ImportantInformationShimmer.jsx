import React from 'react';
import Shimmer from '../../ui/Shimmer';

const ImportantInformationShimmer = () => {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center mb-4">
        <Shimmer className="h-10 w-10 rounded-lg mr-2" />
        <Shimmer className="h-6 w-2/3" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-start">
            <Shimmer className="h-5 w-5 rounded-full mr-2" />
            <div className="w-full space-y-2 ml-2">
              <Shimmer className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportantInformationShimmer;
