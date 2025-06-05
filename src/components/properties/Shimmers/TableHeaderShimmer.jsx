const TableHeaderShimmer = () => {
  return (
    <div className="p-4 border-b border-grey-outline relative overflow-hidden">
      <div className="absolute inset-0 shimmer"></div>
      <div className="flex justify-between items-center relative z-10">
        <div className="flex gap-3 items-center">
          {/* Search bar placeholder */}
          <div className="w-64 h-10 bg-grey-fill rounded-lg"></div>

          {/* Filter button placeholders */}
          <div className="w-28 h-10 bg-grey-fill rounded-lg"></div>
          <div className="w-28 h-10 bg-grey-fill rounded-lg"></div>
        </div>

        <div className="flex gap-2 items-center">
          {/* View mode switcher placeholder */}
          <div className="w-20 h-8 bg-grey-fill rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default TableHeaderShimmer;
