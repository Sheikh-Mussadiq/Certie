const DayView = ({ currentDate }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-2 border-b border-grey-outline">
        <div className="w-20" /> {/* Time column */}
        <div className="py-2 text-center">
          <div className="text-sm font-medium text-primary-grey">
            {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
          </div>
          <div className="text-sm text-primary-black">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-2">
        <div className="w-20">
          {" "}
          {/* Time column */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-12 border-b border-grey-outline text-xs text-primary-grey pr-2 text-right"
            >
              {hour.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        <div className="border-l border-grey-outline">
          {hours.map((hour) => (
            <div key={hour} className="h-12 border-b border-grey-outline" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
