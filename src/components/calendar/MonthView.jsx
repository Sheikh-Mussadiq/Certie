import Tooltip from "../ui/Tooltip";

const MonthView = ({
  currentDate,
  getEventsForDay,
  loading,
  onAssessmentClick,
}) => {
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
      const dayEvents = getEventsForDay ? getEventsForDay(i, currentDate) : [];

      days.push({
        date: i,
        isCurrentMonth: true,
        events: dayEvents,
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
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if column header is today's weekday
  const isTodayColumn = (index) => {
    const today = new Date();
    // Our weekDays array has SUN at index 0, need to match with JavaScript's getDay()
    return today.getDay() === index;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary-grey">Loading calendar events...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="py-2 text-sm font-semibold text-center border-b border-grey-outline text-primary-grey flex justify-center items-center"
          >
            <span
              className={`px-3 py-1 rounded-md ${
                isTodayColumn(index) ? "bg-primary-black text-white" : ""
              }`}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 overflow-hidden">
        {days.map((day, index) => (
          <div
            key={index}
            className={`border-b border-r border-grey-outline p-2 relative flex flex-col ${
              day.isCurrentMonth ? "bg-white" : "bg-grey-fill/50"
            } ${
              isToday(day.date) && day.isCurrentMonth
                ? "bg-primary-black/5"
                : ""
            }`}
          >
            {!day.isCurrentMonth && (
              <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)",
                    backgroundSize: "14px 14px",
                  }}
                ></div>
              </div>
            )}

            <div className="mt-1 space-y-1 overflow-hidden flex-1 relative z-10">
              {day.events && day.events.length > 0
                ? day.events.slice(0, 3).map((event, eventIndex) => (
                    <Tooltip
                      key={eventIndex}
                      content={`Click to view details for ${event.title}`}
                      position="top"
                    >
                      <div
                        className={`text-xs p-1 rounded ${
                          event.color || "bg-blue-100 text-blue-800"
                        } truncate hover:bg-opacity-90 cursor-pointer transition-colors`}
                        onClick={() =>
                          onAssessmentClick && onAssessmentClick(event)
                        }
                      >
                        {event.title}
                      </div>
                    </Tooltip>
                  ))
                : null}
              {day.events && day.events.length > 3 && (
                <div className="text-xs p-1 rounded bg-gray-100 text-gray-800 truncate">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>

            <div className="flex justify-end items-end relative z-10">
              <span
                className={`text-xs font-medium ${
                  isToday(day.date) && day.isCurrentMonth
                    ? "h-6 w-8 flex items-center justify-center bg-primary-black text-white rounded-md"
                    : day.isCurrentMonth
                    ? "text-primary-black"
                    : "text-primary-grey"
                }`}
              >
                {day.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
