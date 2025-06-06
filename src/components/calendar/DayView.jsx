const DayView = ({ currentDate }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Mock events data
  const events = [
    {
      title: "Call Back WeCraft",
      start: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        15,
        0
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
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
        currentDate.getDate(),
        9,
        0
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        10,
        0
      ),
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
  ];

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

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-2 border-b border-grey-outline">
        <div className="w-20" /> {/* Time column */}
        <div className="py-2 text-center">
          <div className="text-sm font-medium text-primary-grey">
            {currentDate
              .toLocaleDateString("en-US", { weekday: "long" })
              .toUpperCase()}
          </div>
          <div
            className={`text-sm font-medium ${
              isToday()
                ? "h-6 w-8 flex items-center justify-center bg-primary-black text-white rounded-md mx-auto"
                : "text-primary-black"
            }`}
          >
            {currentDate.getDate()}
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 min-h-[600px]">
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

        <div className="border-l border-grey-outline relative">
          {hours.map((hour) => (
            <div key={hour} className="h-12 border-b border-grey-outline" />
          ))}

          {/* Events */}
          {events.map((event, index) => {
            const style = getEventStyle(event);
            return (
              <div
                key={index}
                className={`absolute left-0 right-0 mx-1 p-2 rounded border ${event.color} text-xs overflow-hidden cursor-pointer transition-opacity hover:opacity-90`}
                style={style}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-[10px]">
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
  );
};

export default DayView;
