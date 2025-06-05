import CalendarComponent from "../components/calendar/Calendar";

const Calendar = () => {
  return (
    <div className="p-8 flex flex-col h-screen overflow-hidden">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-primary-black">Calendar</h1>
        <p className="text-sm text-primary-grey">
          Streamline work, save your time and growth easier
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <CalendarComponent />
      </div>
    </div>
  );
};

export default Calendar;
