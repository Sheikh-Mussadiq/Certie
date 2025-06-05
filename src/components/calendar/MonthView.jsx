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
          i === 25 && {
            title: "Assessment Booked",
            type: "assessment",
            color: "bg-blue-100 text-blue-800",
          },
          i === 27 && {
            title: "Call Back WeCraft",
            type: "call",
            color: "bg-amber-100 text-amber-800",
          },
          i === 28 && {
            title: "Call Back WeCraft",
            type: "call",
            color: "bg-amber-100 text-amber-800",
          },
          i === 3 && {
            title: "Assessment Booked",
            type: "assessment",
            color: "bg-indigo-100 text-indigo-800",
          },
          i === 6 && {
            title: "Call Back WeCraft",
            type: "call",
            color: "bg-amber-100 text-amber-800",
          },
          i === 12 && [
            {
              title: "Meeting with sam",
              type: "meeting",
              color: "bg-green-100 text-green-800",
            },
            {
              title: "Call Back WeCraft",
              type: "call",
              color: "bg-amber-100 text-amber-800",
            },
            {
              title: "+2 more",
              type: "more",
              color: "bg-gray-100 text-gray-800",
            },
          ],
          i === 12 - 1 && [
            {
              title: "Meeting with sam",
              type: "meeting",
              color: "bg-green-100 text-green-800",
            },
          ],
          i === 10 && {
            title: "Sam's birthday party",
            type: "event",
            color: "bg-red-100 text-red-800",
          },
          i === 15 && {
            title: "Call Back WeCraft",
            type: "call",
            color: "bg-amber-100 text-amber-800",
          },
          i === 19 && {
            title:
              "Meeting with Cameron Williamson about to finalize the draft",
            type: "meeting",
            color: "bg-red-100 text-red-800",
          },
          i === 20 && {
            title:
              "Meeting with Cameron Williamson about to finalize the draft version of wecraft marketing",
            type: "meeting",
            color: "bg-red-100 text-red-800",
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="py-2 text-xs font-medium text-center border-b border-grey-outline text-primary-grey flex justify-center items-center"
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
              {Array.isArray(day.events)
                ? day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded ${
                        event.color || "bg-blue-100 text-blue-800"
                      } truncate hover:bg-opacity-90 cursor-pointer transition-colors`}
                    >
                      {event.title}
                    </div>
                  ))
                : day.events && (
                    <div
                      className={`text-xs p-1 rounded ${
                        day.events.color || "bg-blue-100 text-blue-800"
                      } truncate hover:bg-opacity-90 cursor-pointer transition-colors`}
                    >
                      {day.events.title}
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
