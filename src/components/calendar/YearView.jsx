import Tooltip from "../ui/Tooltip";

const YearView = ({
  currentDate,
  getEventsForDay,
  loading,
  onEventClick,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Check if a day is today
  const isToday = (day, month) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if a day has events
  const hasEvents = (day, month) => {
    if (!getEventsForDay || !day) return false;
    const events = getEventsForDay(
      day,
      new Date(currentDate.getFullYear(), month, 1)
    );
    return events && events.length > 0;
  };

  // Get events for a day
  const getEvents = (day, month) => {
    if (!getEventsForDay || !day) return [];
    return (
      getEventsForDay(day, new Date(currentDate.getFullYear(), month, 1)) || []
    );
  };

  // Handle clicking on a day with events
  const handleDayClick = (day, month) => {
    if (day && hasEvents(day, month) && onEventClick) {
      const events = getEvents(day, month);
      // If there are multiple events, pass the first one
      if (events.length > 0) {
        onEventClick(events[0]);
      }
    }
  };

  const year = currentDate.getFullYear();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-primary-grey text-sm">Loading calendar events...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4 overflow-auto h-full">
      {months.map((monthName, monthIndex) => (
        <div
          key={monthName}
          className="border border-grey-outline rounded-lg overflow-hidden min-w-0"
        >
          <div className="bg-grey-fill px-2 sm:px-3 py-1.5 sm:py-2 border-b border-grey-outline">
            <h3 className="text-xs sm:text-sm font-semibold text-secondary-black truncate">
              {monthName}
            </h3>
          </div>
          <div className="p-1.5 sm:p-2">
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {/* Day Headers */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-[9px] sm:text-[10px] text-primary-grey font-semibold h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {getMonthDays(year, monthIndex).map((day, dayIndex) => {
                return hasEvents(day, monthIndex) ? (
                  <Tooltip
                    key={dayIndex}
                    content="Click to view event details"
                    position="top"
                    theme="primary"
                  >
                    <div
                      className={`text-[9px] sm:text-[10px] h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center relative ${
                        day === null
                          ? ""
                          : isToday(day, monthIndex)
                          ? "bg-primary-black text-white font-bold rounded-md"
                          : "bg-blue-100 text-blue-800 font-medium rounded-md cursor-pointer"
                      }`}
                      onClick={() => handleDayClick(day, monthIndex)}
                    >
                      {day}
                      {day && hasEvents(day, monthIndex) && (
                        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </Tooltip>
                ) : (
                  <div
                    key={dayIndex}
                    className={`text-[9px] sm:text-[10px] h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center relative ${
                      day === null
                        ? ""
                        : isToday(day, monthIndex)
                        ? "bg-primary-black text-white font-bold rounded-md"
                        : "text-primary-black"
                    }`}
                  >
                    {day}
                    {day && hasEvents(day, monthIndex) && (
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearView;
