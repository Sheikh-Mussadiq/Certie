import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = ({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}) => {
  const formatDate = () => {
    const options = { month: "long", year: "numeric" };
    if (view === "day") {
      options.day = "numeric";
    }
    return currentDate.toLocaleDateString("en-US", options);
  };

  return (
    <div className="flex items-center justify-between p-4 ">
      <div className="flex items-center gap-4">
        <div className="flex bg-grey-fill rounded-lg">
          {[
            // "Day", "Week",
            "Month",
            "Year",
          ].map((viewOption) => (
            <button
              key={viewOption}
              onClick={() => onViewChange(viewOption.toLowerCase())}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                view === viewOption.toLowerCase()
                  ? "bg-white text-secondary-black border border-grey-outline"
                  : "text-primary-grey hover:text-primary-black"
              }`}
            >
              {viewOption}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{formatDate()}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-1 hover:bg-grey-fill rounded-md transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="p-1 hover:bg-grey-fill rounded-md transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onToday}
          className="px-4 py-2 text-xs font-medium text-white bg-primary-black rounded-lg transition-colors hover:bg-gray-800"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
