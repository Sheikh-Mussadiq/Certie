import { Plus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OverviewHeader = ({ children, selectedPropertyId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-secondary-black">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-primary-grey">
          A summary of your properties and activities.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <div className="w-full">{children}</div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              if (selectedPropertyId) {
                navigate(`/properties/${selectedPropertyId}/assessments`);
              } else {
                navigate("/bookings");
              }
            }}
            className="inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium text-white bg-primary-black rounded-lg shadow-sm hover:bg-primary-black/90 transition-colors duration-200 min-w-32 whitespace-nowrap"
          >
            {selectedPropertyId ? "Book Assessment" : "Bookings"}
          </button>
          <button
            onClick={() => {
              if (selectedPropertyId) {
                navigate(`/properties/${selectedPropertyId}/logbooks`);
              } else {
                navigate("/logbooks");
              }
            }}
            className="inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium text-white bg-primary-black rounded-lg shadow-sm hover:bg-primary-black/90 transition-colors duration-200 min-w-32 whitespace-nowrap"
          >
            {selectedPropertyId ? "Add Logbook" : "Logbooks"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewHeader;
