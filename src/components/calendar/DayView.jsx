import Tooltip from "../ui/Tooltip";

const DayView = ({ currentDate, getEventsForDate, loading, onAssessmentClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Get real events for the current date
  const events = getEventsForDate ? getEventsForDate(currentDate) : [];

  // console.log("DayView - currentDate:", currentDate);
  // console.log("DayView - events:", events);

  // Function to position events in the grid
  const getEventStyle = (event) => {
    const startHour = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinutes = event.end.getMinutes();

    const top = (startHour + startMinutes / 60) * 48; // 48px per hour (4px per 5 minutes)
    const height =
      (endHour + endMinutes / 60 - startHour - startMinutes / 60) * 48;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  // Check if this day is today
  const isToday = () => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary-grey">Loading calendar events...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Fixed Date Header */}
      <div className="grid grid-cols-2 border-b border-grey-outline bg-white sticky top-0 z-20">
        <div className="w-20" /> {/* Time column */}
        <div className="py-2 text-center">
          <div className="text-sm font-semibold text-primary-grey">
            {currentDate
              .toLocaleDateString("en-US", { weekday: "long" })
              .toUpperCase()}
          </div>
          <div
            className={`text-sm font-semibold ${
              isToday()
                ? "h-6 w-8 flex items-center justify-center bg-primary-black text-white rounded-md mx-auto"
                : "text-primary-black"
            }`}
          >
            {currentDate.getDate()}
          </div>
        </div>
      </div>

      {/* Scrollable Time Grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative grid grid-cols-2 min-h-[1152px]">
          {" "}
          {/* 24 hours * 48px = 1152px */}
          <div className="w-20 pt-2 bg-white">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-12 border-b border-grey-outline text-xs text-primary-grey pr-2 text-right flex items-center justify-end"
              >
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          <div className="border-l border-grey-outline relative bg-white">
            {hours.map((hour) => (
              <div key={hour} className="h-12 border-b border-grey-outline" />
            ))}

            {/* Events */}
            {events.map((event, index) => {
              const style = getEventStyle(event);
              return (
                <Tooltip
                  key={index}
                  content={`Click to view details for ${event.title}`}
                  position="top"
                >
                  <div
                    className={`absolute left-0 right-0 mx-1 p-2 rounded border ${event.color} text-xs overflow-hidden cursor-pointer transition-opacity hover:opacity-90 z-10`}
                    style={style}
                    onClick={() => onAssessmentClick && onAssessmentClick(event)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-[10px]">
                      {event.start.getHours().toString().padStart(2, "0")}:
                      {event.start.getMinutes().toString().padStart(2, "0")} -
                      {event.end.getHours().toString().padStart(2, "0")}:
                      {event.end.getMinutes().toString().padStart(2, "0")}
                    </div>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
