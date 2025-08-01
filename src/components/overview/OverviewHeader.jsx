import { Plus, ChevronDown } from "lucide-react";

const OverviewHeader = () => {
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
        {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
          <span>Switch Property</span>
          <ChevronDown size={16} />
        </button> */}
        {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-sm hover:bg-gray-900">
          <Plus size={16} />
          <span>Add New Task</span>
        </button> */}
      </div>
    </div>
  );
};

export default OverviewHeader;
