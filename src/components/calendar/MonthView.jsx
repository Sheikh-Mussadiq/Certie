const MonthView = ({ currentDate }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const previousMonthDays = new Date(year, month, 0).getDate();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: previousMonthDays - i,
        isCurrentMonth: false,
        events: [],
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        events: [
          // Mock events
          i === 15 && { title: "Call Back WeCraft", type: "meeting" },
          i === 20 && {
            title: "Meeting with Cameron Williamson",
            type: "meeting",
          },
        ].filter(Boolean),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        events: [],
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex-1">
      <div className="grid grid-cols-7 border-b border-grey-outline">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-sm font-medium text-primary-grey text-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6 h-[calc(100vh-16rem)]">
        {days.map((day, index) => (
          <div
            key={index}
            className={`border-b border-r border-grey-outline p-2 overflow-auto ${
              day.isCurrentMonth ? "bg-white" : "bg-grey-fill/50"
            }`}
          >
            <span
              className={`text-sm ${
                day.isCurrentMonth ? "text-primary-black" : "text-primary-grey"
              }`}
            >
              {day.date}
            </span>

            <div className="mt-1 space-y-1">
              {day.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate hover:bg-blue-200 cursor-pointer transition-colors"
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
