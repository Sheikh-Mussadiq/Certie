import React from 'react';
import Shimmer from '../../ui/Shimmer';

const ComplianceScoreShimmer = () => {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-center mb-12">
        <Shimmer className="h-6 w-1/2" />
      </div>
      <div className="flex justify-between items-baseline">
        <Shimmer className="h-10 w-1/4" />
        <div className="flex items-center">
          <Shimmer className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
};

export default ComplianceScoreShimmer;
