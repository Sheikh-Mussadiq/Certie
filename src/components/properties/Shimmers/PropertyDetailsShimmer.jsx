const PropertyDetailsShimmer = () => {
  return (
    <div className="p-8">
      {/* Header Shimmer */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-grey-fill rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
          <div className="h-4 w-64 bg-grey-fill rounded relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>
        <div className="h-10 w-32 bg-grey-fill rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 shimmer"></div>
        </div>
      </div>

      {/* Tabs Shimmer */}
      <div className="flex space-x-2 mb-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-10 w-28 bg-grey-fill rounded-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 shimmer"></div>
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-xl border border-grey-outline overflow-hidden">
        <div className="p-6">
          {/* Property Name & Image */}
          <div className="space-y-8">
            <div>
              <div className="h-6 w-56 bg-grey-fill rounded mb-4 relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
              </div>
              <div className="max-w-3xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-lg bg-grey-fill relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
              </div>
            </div>

            {/* Property & Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Property Info Card */}
              <div className="border border-grey-outline rounded-2xl md:rounded-r-none">
                <div className="p-4 border-b border-grey-outline relative overflow-hidden">
                  <div className="h-5 w-40 bg-grey-fill rounded relative overflow-hidden">
                    <div className="absolute inset-0 shimmer"></div>
                  </div>
                </div>
                <div className="divide-y divide-grey-outline">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center px-4 py-3 relative overflow-hidden"
                      >
                        <div className="w-8 h-8 bg-grey-fill rounded-full mr-3 relative">
                          <div className="absolute inset-0 shimmer"></div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-24 bg-grey-fill rounded relative overflow-hidden">
                            <div className="absolute inset-0 shimmer"></div>
                          </div>
                          <div className="h-4 w-32 bg-grey-fill rounded relative overflow-hidden">
                            <div className="absolute inset-0 shimmer"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="border border-grey-outline rounded-2xl md:rounded-l-none md:border-l-0">
                <div className="p-4 border-b border-grey-outline relative overflow-hidden">
                  <div className="h-5 w-40 bg-grey-fill rounded relative overflow-hidden">
                    <div className="absolute inset-0 shimmer"></div>
                  </div>
                </div>
                <div className="divide-y divide-grey-outline">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center px-4 py-3 relative overflow-hidden"
                      >
                        <div className="w-8 h-8 bg-grey-fill rounded-full mr-3 relative">
                          <div className="absolute inset-0 shimmer"></div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-24 bg-grey-fill rounded relative overflow-hidden">
                            <div className="absolute inset-0 shimmer"></div>
                          </div>
                          <div className="h-4 w-32 bg-grey-fill rounded relative overflow-hidden">
                            <div className="absolute inset-0 shimmer"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Protection Assets Section */}
          <div className="py-8 mt-8 border-t border-grey-outline">
            <div className="h-6 w-48 bg-grey-fill rounded mb-4 relative overflow-hidden">
              <div className="absolute inset-0 shimmer"></div>
            </div>
            <div className="bg-white rounded-2xl border border-grey-outline overflow-hidden">
              <div className="grid grid-cols-3 border-b border-grey-outline">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 relative overflow-hidden">
                    <div className="h-5 w-20 bg-grey-fill rounded relative overflow-hidden">
                      <div className="absolute inset-0 shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 border-b border-grey-outline last:border-b-0"
                  >
                    {[1, 2, 3].map((col) => (
                      <div key={col} className="p-4 relative overflow-hidden">
                        <div className="h-5 w-full bg-grey-fill rounded relative overflow-hidden">
                          <div className="absolute inset-0 shimmer"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsShimmer;
