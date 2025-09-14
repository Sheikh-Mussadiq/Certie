import Shimmer from "../../ui/Shimmer";

const PropertyGridShimmer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-grey-outline p-4 space-y-4"
        >
          <div className="flex items-start gap-3">
            <Shimmer className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-5 w-3/4" />
              <Shimmer className="h-4 w-1/2" />
            </div>
          </div>
          {/* <div className="space-y-2">
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-2/3" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <Shimmer className="h-8 w-24 rounded-lg" />
            <Shimmer className="h-6 w-6 rounded-full" />
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default PropertyGridShimmer;
