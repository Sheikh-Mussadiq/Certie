const WeekView = ({ currentDate }) => {
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

  // Mock events data
  const events = [
    {
      title: "Call Back WeCraft",
      start: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
        15,
        0
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
        16,
        0
      ),
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      title: "Meeting with Cameron Williamson",
      start: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        11,
        0
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        12,
        30
      ),
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      title: "Assessment Booked",
      start: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1,
        9,
        0
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1,
        10,
        0
      ),
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      title: "Meeting with sam",
      start: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 2,
        14,
        0
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 2,
        15,
        30
      ),
      color: "bg-green-100 text-green-800 border-green-200",
    },
  ];

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

    const top = (startHour + startMinutes / 60) * 48; // 48px per hour (4px per 5 minutes)
    const height =
      (endHour + endMinutes / 60 - startHour - startMinutes / 60) * 48;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  // Function to check if event belongs to a day
  const eventBelongsToDay = (event, day) => {
    return (
      event.start.getDate() === day.getDate() &&
      event.start.getMonth() === day.getMonth() &&
      event.start.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-8 border-b border-grey-outline">
        <div className="w-20" /> {/* Time column */}
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="py-2 text-center">
            <div className="text-xs font-medium text-primary-grey">
              {day
                .toLocaleDateString("en-US", { weekday: "short" })
                .toUpperCase()}
            </div>
            <div
              className={`text-sm font-medium ${
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

      <div className="relative grid grid-cols-8 min-h-[600px]">
        <div className="w-20 pt-2">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-12 border-b border-grey-outline text-xs text-primary-grey pr-2 text-right"
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

        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="border-l border-grey-outline relative"
          >
            {hours.map((hour) => (
              <div key={hour} className="h-12 border-b border-grey-outline" />
            ))}

            {/* Events for this day */}
            {events
              .filter((event) => eventBelongsToDay(event, day))
              .map((event, index) => {
                const style = getEventStyle(event);
                return (
                  <div
                    key={index}
                    className={`absolute left-0 right-0 mx-1 p-1 rounded border ${event.color} text-xs overflow-hidden cursor-pointer transition-opacity hover:opacity-90`}
                    style={style}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-[10px] truncate">
                      {event.start.getHours().toString().padStart(2, "0")}:
                      {event.start.getMinutes().toString().padStart(2, "0")} -
                      {event.end.getHours().toString().padStart(2, "0")}:
                      {event.end.getMinutes().toString().padStart(2, "0")}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
