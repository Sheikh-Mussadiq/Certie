const TableFooter = ({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  return (
    <div className="flex justify-between items-center p-4 border-t border-grey-outline">
      <div className="flex items-center gap-2">
        <span className="text-sm text-primary-grey">Show</span>
        <select
          className="px-2 py-1 border border-grey-outline rounded text-sm"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-primary-grey">entries</span>
      </div>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-colors ${
              currentPage === i + 1
                ? "bg-primary-orange text-white"
                : "text-primary-black hover:bg-grey-fill"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TableFooter