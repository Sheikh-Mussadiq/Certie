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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <div className="flex bg-grey-fill rounded-lg">
          {[
            // "Day", "Week",
            "Month",
            "Year",
          ].map((viewOption) => (
            <button
              key={viewOption}
              onClick={() => onViewChange(viewOption.toLowerCase())}
              className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <h2 className="text-base sm:text-lg font-semibold order-2 sm:order-1">{formatDate()}</h2>
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto order-1 sm:order-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onPrevious}
              className="p-1 hover:bg-grey-fill rounded-md transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onNext}
              className="p-1 hover:bg-grey-fill rounded-md transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <button
            onClick={onToday}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-white bg-primary-black rounded-lg transition-colors hover:bg-gray-800"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
