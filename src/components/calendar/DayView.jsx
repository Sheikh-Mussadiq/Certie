const DayView = ({ currentDate, getEventsForDate, loading, onEventClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Get real events for the current date
  const events = getEventsForDate ? getEventsForDate(currentDate) : [];

  // Debug logging
  console.log("DayView - currentDate:", currentDate.toISOString());
  console.log("DayView - events count:", events.length);

  // console.log("DayView - currentDate:", currentDate);
  // console.log("DayView - events:", events);

  // Function to position events in the grid
  const getEventStyle = (event) => {
    try {
      // Ensure we're working with proper date objects
      const startTime = new Date(event.start);
      const endTime = new Date(event.end);

      const startHour = startTime.getHours();
      const startMinutes = startTime.getMinutes();
      const endHour = endTime.getHours();
      const endMinutes = endTime.getMinutes();

      const top = (startHour + startMinutes / 60) * 48; // 48px per hour
      const height = Math.max(
        (endHour + endMinutes / 60 - startHour - startMinutes / 60) * 48,
        36 // Minimum height to ensure visibility
      );

      return {
        top: `${top}px`,
        height: `${height}px`,
        left: '4px',
        right: '4px',
        width: 'auto',
      };
    } catch (err) {
      console.error("Error calculating event style:", err, event);
      return { top: "0px", height: "48px", left: '4px', right: '4px', width: 'auto' }; // Default positioning
    }
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
      <div className="flex border-b border-grey-outline bg-white sticky top-0 z-20">
        <div className="w-16 flex-shrink-0" /> {/* Time column */}
        <div className="flex-1 py-2 text-center">
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
        <div className="flex min-h-[1152px]">
          {/* Time column */}
          <div className="w-16 flex-shrink-0 bg-white">
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
          
          {/* Day column */}
          <div className="flex-1 border-l border-grey-outline relative bg-white">
            {/* Time grid cells */}
            {hours.map((hour) => (
              <div key={hour} className="h-12 border-b border-grey-outline" />
            ))}

            {/* Events container positioned absolutely over the grid */}
            <div className="absolute inset-0 pointer-events-none">
              {events.map((event, index) => {
                const style = getEventStyle(event);
                return (
                  <div
                    key={index}
                    className={`absolute px-3 py-2 rounded border ${event.color} text-xs overflow-hidden cursor-pointer transition-all hover:shadow-md hover:z-20 z-10 pointer-events-auto`}
                    style={style}
                    onClick={() => onEventClick && onEventClick(event)}
                  >
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-[10px] opacity-90">
                      {event.start.getHours().toString().padStart(2, "0")}:
                      {event.start.getMinutes().toString().padStart(2, "0")} -
                      {event.end.getHours().toString().padStart(2, "0")}:
                      {event.end.getMinutes().toString().padStart(2, "0")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
