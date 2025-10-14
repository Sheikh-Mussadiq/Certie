import { ChevronLeft, ChevronRight } from "lucide-react";

const TableFooter = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 p-3 sm:p-4 border-t border-grey-outline">
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-secondary-black">Show</span>
        <select
          className="px-2 py-1 border border-grey-outline rounded-md text-xs sm:text-sm focus:outline-none focus:ring-primary-black focus:border-primary-black"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          // className={`px-3 py-1 rounded text-sm ${
          //   currentPage === 1
          //     ? "text-gray-400 cursor-not-allowed"
          //     : "text-primary-black hover:bg-grey-fill"
          // }`}
          className="p-2 rounded-md border border-grey-outline text-primary-grey hover:bg-grey-fill disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            // className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-colors ${
            //   currentPage === i + 1
            //     ? "bg-primary-orange text-white"
            //     : "text-primary-black hover:bg-grey-fill"
            // }`}
            className={`px-3 py-1 rounded-md border border-grey-outline hover:bg-grey-fill ${
              currentPage === i + 1
                ? "bg-grey-fill text-primary-black"
                : "bg-white text-primary-grey"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          // className={`px-3 py-1 rounded text-sm ${
          //   currentPage === totalPages
          //     ? "text-gray-400 cursor-not-allowed"
          //     : "text-primary-black hover:bg-grey-fill"
          // }`}
          className="p-2 rounded-md border border-grey-outline text-primary-grey hover:bg-grey-fill disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TableFooter;
