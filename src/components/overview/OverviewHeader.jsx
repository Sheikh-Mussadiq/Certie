import { Plus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OverviewHeader = ({ children, selectedPropertyId }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-xl font-semibold text-secondary-black">
          Dashboard
        </h1>
        <p className="text-primary-grey">
          A summary of your properties and activities.
        </p>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedPropertyId) {
                navigate(`/properties/${selectedPropertyId}/assessments`);
              } else {
                navigate("/bookings");
              }
            }}
           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-black rounded-lg shadow-sm hover:bg-primary-black/90"
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-black rounded-lg shadow-sm hover:bg-primary-black/90"
          >
            {/* <Plus size={16} /> */}
            {selectedPropertyId ? "Add LogBook" : "LogBooks"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewHeader;
