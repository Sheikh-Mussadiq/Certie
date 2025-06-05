const PropertyListShimmer = ({ count = 5 }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="border border-grey-outline rounded-lg p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 shimmer"></div>

            {/* Header with checkbox and image */}
            <div className="flex items-center mb-4 relative z-10">
              <div className="w-5 h-5 bg-grey-fill rounded mr-3"></div>
              <div className="w-12 h-12 bg-grey-fill rounded-md mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-grey-fill rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-grey-fill rounded w-1/2"></div>
              </div>
            </div>

            {/* Property details */}
            <div className="space-y-3 mb-4 relative z-10">
              <div className="flex justify-between">
                <div className="w-1/2">
                  <div className="h-3 bg-grey-fill rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-grey-fill rounded w-1/2"></div>
                </div>
                <div className="w-1/2">
                  <div className="h-3 bg-grey-fill rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-grey-fill rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-1/2">
                  <div className="h-3 bg-grey-fill rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-grey-fill rounded w-1/2"></div>
                </div>
                <div className="w-1/2">
                  <div className="h-3 bg-grey-fill rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-grey-fill rounded w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Footer with score indicators */}
            <div className="flex justify-between pt-3 border-t border-grey-outline relative z-10">
              <div>
                <div className="h-3 bg-grey-fill rounded w-16 mb-1"></div>
                <div className="h-6 bg-grey-fill rounded-full w-16"></div>
              </div>
              <div>
                <div className="h-3 bg-grey-fill rounded w-16 mb-1"></div>
                <div className="h-6 bg-grey-fill rounded-full w-16"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PropertyListShimmer;
