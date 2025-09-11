import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import YearView from "./YearView";
import { useCalendarBookings } from "../../hooks/useCalendarBookings";

const Calendar = () => {
  const navigate = useNavigate();
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

  const handleEventClick = (event) => {
    console.log("Calendar event clicked - full object:", event);

    if (!event) return;

    // Determine the type of event (assessment or logbook)
    if (event.type === "assessment") {
      handleAssessmentClick(event);
    } else if (event.type === "logbook") {
      handleLogbookClick(event);
    }
  };

  const handleAssessmentClick = (assessment) => {
    console.log("Assessment clicked - full object:", assessment);

    if (assessment) {
      // The booking object is stored within the assessment object
      // Check if we have booking.property_id, booking.properties.id, or properties.property_id
      let propertyId = null;

      if (assessment.booking) {
        console.log("Found booking object:", assessment.booking);
        // First try property_id directly on booking
        propertyId = assessment.booking.property_id;

        // Then try properties.id or properties.property_id
        if (!propertyId && assessment.booking.properties) {
          propertyId =
            assessment.booking.properties.id ||
            assessment.booking.properties.property_id;
        }
      }

      // Fallback to the raw properties on assessment
      if (!propertyId && assessment.properties) {
        propertyId =
          assessment.properties.id || assessment.properties.property_id;
      }

      if (propertyId) {
        console.log("Redirecting to property:", propertyId);
        navigate(`/properties/${propertyId}/assessments`);
      } else {
        console.log(
          "No property ID found in the assessment object - check console for full object structure"
        );
      }
    }
  };

  const handleLogbookClick = (logbookEvent) => {
    console.log("Logbook clicked - full object:", logbookEvent);

    if (logbookEvent && logbookEvent.property_id) {
      // Navigate to the property's logbook page
      console.log("Redirecting to property logbook:", logbookEvent.property_id);
      navigate(`/properties/${logbookEvent.property_id}/logbooks`);
    } else {
      console.log("No property ID found in the logbook event");
    }
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
            onEventClick={handleEventClick}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            formatBookingsForCalendar={formatBookingsForCalendar}
            loading={loading}
            onEventClick={handleEventClick}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            getEventsForDate={getEventsForDate}
            loading={loading}
            onEventClick={handleEventClick}
          />
        )}
        {view === "year" && (
          <YearView
            currentDate={currentDate}
            getEventsForDay={getEventsForDay}
            loading={loading}
            onEventClick={handleEventClick}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
