const PropertyShimmer = ({ count = 5 }) => {
  return (
    <div className="w-full relative overflow-hidden">
      <div className="space-y-4">
        {/* Shimmer for table rows */}
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center p-4 border-b border-grey-outline last:border-b-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer"></div>

              {/* Checkbox placeholder */}
              <div className="w-5 h-5 bg-grey-fill rounded mr-4 relative z-10"></div>

              {/* Property image placeholder */}
              <div className="w-12 h-12 bg-grey-fill rounded-md mr-4 relative z-10"></div>

              {/* Property info placeholder */}
              <div className="flex-1 space-y-2 relative z-10">
                <div className="h-4 bg-grey-fill rounded w-1/3"></div>
                <div className="h-3 bg-grey-fill rounded w-1/4"></div>
              </div>

              {/* Property manager placeholder */}
              <div className="w-1/5 space-y-2 mr-4 relative z-10">
                <div className="h-4 bg-grey-fill rounded w-3/4"></div>
                <div className="h-3 bg-grey-fill rounded w-1/2"></div>
              </div>

              {/* Score placeholders */}
              <div className="w-1/6 mr-4 relative z-10">
                <div className="h-6 bg-grey-fill rounded-full w-16"></div>
              </div>
              <div className="w-1/6 mr-4 relative z-10">
                <div className="h-6 bg-grey-fill rounded-full w-16"></div>
              </div>

              {/* Status placeholder */}
              <div className="w-1/6 relative z-10">
                <div className="h-4 bg-grey-fill rounded w-20"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PropertyShimmer;
