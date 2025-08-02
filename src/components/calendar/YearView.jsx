const YearView = ({ currentDate, getEventsForDay, loading }) => {
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

  const year = currentDate.getFullYear();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary-grey">Loading calendar events...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4 overflow-auto h-full">
      {months.map((monthName, monthIndex) => (
        <div
          key={monthName}
          className="border border-grey-outline rounded-lg overflow-hidden"
        >
          <div className="bg-grey-fill px-3 py-2 border-b border-grey-outline">
            <h3 className="text-sm font-semibold text-secondary-black">
              {monthName}
            </h3>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-[10px] text-primary-grey font-semibold h-5 w-5 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {getMonthDays(year, monthIndex).map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`text-[10px] h-5 w-5 flex items-center justify-center relative ${
                    day === null
                      ? ""
                      : isToday(day, monthIndex)
                      ? "bg-primary-black text-white font-bold rounded-md"
                      : hasEvents(day, monthIndex)
                      ? "bg-blue-100 text-blue-800 font-medium rounded-md"
                      : "text-primary-black"
                  }`}
                >
                  {day}
                  {day && hasEvents(day, monthIndex) && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearView;
