import CalendarComponent from "../components/calendar/Calendar";

const Calendar = () => {
  return (
    <div className="p-8 h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary-black">Calendar</h1>
        <p className="text-sm text-primary-grey">
          Streamline work, save your time and growth easier
        </p>
      </div>

      <CalendarComponent />
    </div>
  );
};

export default Calendar;
