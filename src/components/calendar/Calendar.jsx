import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import YearView from "./YearView";
import { useCalendarBookings } from "../../hooks/useCalendarBookings";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // 'month', 'week', 'day', 'year'
  const {
    bookings,
    loading,
    error,
    formatBookingsForCalendar,
    getEventsForDate,
    getEventsForDay,
  } = useCalendarBookings();

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === "month") {
        newDate.setMonth(prev.getMonth() - 1);
      } else if (view === "week") {
        newDate.setDate(prev.getDate() - 7);
      } else if (view === "year") {
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setDate(prev.getDate() - 1);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === "month") {
        newDate.setMonth(prev.getMonth() + 1);
      } else if (view === "week") {
        newDate.setDate(prev.getDate() + 7);
      } else if (view === "year") {
        newDate.setFullYear(prev.getFullYear() + 1);
      } else {
        newDate.setDate(prev.getDate() + 1);
      }
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl border border-grey-outline overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 font-medium mb-2">
              Error loading calendar events
            </div>
            <div className="text-sm text-primary-grey">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-grey-outline overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />

      <div className="flex-1 overflow-y-auto">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            getEventsForDay={getEventsForDay}
            loading={loading}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            formatBookingsForCalendar={formatBookingsForCalendar}
            loading={loading}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            getEventsForDate={getEventsForDate}
            loading={loading}
          />
        )}
        {view === "year" && (
          <YearView
            currentDate={currentDate}
            getEventsForDay={getEventsForDay}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
