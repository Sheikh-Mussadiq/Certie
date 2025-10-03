const WeekView = ({
  currentDate,
  formatBookingsForCalendar,
  loading,
  onEventClick,
}) => {
  const getWeekDays = (date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  // Get real events from bookings
  const events = formatBookingsForCalendar ? formatBookingsForCalendar() : [];

  // console.log("WeekView - currentDate:", currentDate);
  // console.log("WeekView - events:", events);

  // Check if a day is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Function to position events in the grid
  const getEventStyle = (event) => {
    const startHour = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinutes = event.end.getMinutes();

    const top = (startHour + startMinutes / 60) * 48; // 48px per hour
    const height = Math.max(
      (endHour + endMinutes / 60 - startHour - startMinutes / 60) * 48,
      36 // Minimum height for visibility
    );

    return {
      top: `${top}px`,
      height: `${height}px`,
      left: "2px",
      right: "2px",
      width: "auto",
    };
  };

  // Function to check if event belongs to a day
  const eventBelongsToDay = (event, day) => {
    try {
      // Ensure we're working with proper date objects
      const eventStart = new Date(event.start);

      const belongs =
        eventStart.getDate() === day.getDate() &&
        eventStart.getMonth() === day.getMonth() &&
        eventStart.getFullYear() === day.getFullYear();

      // Debug logging
      console.log(
        `Checking event: ${event.title} on ${day.toDateString()}: ${belongs}`
      );

      return belongs;
    } catch (err) {
      console.error("Error in eventBelongsToDay:", err);
      return false;
    }
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
      {/* Fixed Week Header */}
      <div className="flex border-b border-grey-outline bg-white sticky top-0 z-10">
        <div className="w-16 flex-shrink-0" /> {/* Time column */}
        <div className="flex flex-1">
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="flex-1 py-2 text-center">
              <div className="text-sm font-semibold text-primary-grey">
                {day
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase()}
              </div>
              <div
                className={`text-sm font-semibold ${
                  isToday(day)
                    ? "h-6 w-8 flex items-center justify-center bg-primary-black text-white rounded-md mx-auto"
                    : "text-primary-black"
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
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

          {/* Days columns */}
          <div className="flex flex-1">
            {weekDays.map((day) => {
              const dayEvents = events.filter((event) =>
                eventBelongsToDay(event, day)
              );

              return (
                <div
                  key={day.toISOString()}
                  className="flex-1 border-l border-grey-outline relative bg-white min-w-0"
                >
                  {/* Time grid cells */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-12 border-b border-grey-outline"
                    />
                  ))}

                  {/* Events container positioned absolutely over the grid */}
                  <div className="absolute inset-0 pointer-events-none">
                    {dayEvents.map((event, index) => {
                      const style = getEventStyle(event);
                      return (
                        <div
                          key={index}
                          className={`absolute px-2 py-1 rounded border ${event.color} text-xs overflow-hidden cursor-pointer transition-all hover:shadow-md hover:z-20 z-10 pointer-events-auto`}
                          style={style}
                          onClick={() => onEventClick && onEventClick(event)}
                        >
                          <div className="font-semibold truncate">
                            {event.title}
                          </div>
                          <div className="text-[10px] truncate opacity-90">
                            {event.start.getHours().toString().padStart(2, "0")}
                            :
                            {event.start
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}{" "}
                            - {event.end.getHours().toString().padStart(2, "0")}
                            :
                            {event.end.getMinutes().toString().padStart(2, "0")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
