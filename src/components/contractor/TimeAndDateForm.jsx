import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TimeAndDateForm = ({ onDataChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  // Time selection is commented out for now
  // const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Commented out time slots as they're not needed for now
  /*
  const timeSlots = [
    "12:00 AM",
    "12:30 AM",
    "13:00 AM",
    "13:30 AM",
    "14:00 AM",
    "14:30 AM",
    "15:00 AM",
    "15:30 AM",
    "16:00 AM",
    "16:30 AM",
    "17:00 AM",
    "17:30 AM",
  ];
  */

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateSelect = (day) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(selected);

    // Convert to timestampz format (ISO string) and pass to parent
    if (onDataChange) {
      // Set time to noon (12:00) to avoid timezone issues
      selected.setHours(12, 0, 0, 0);
      onDataChange({
        date: selected,
        time: "12:00 PM", // Default time since time selection is disabled
        timestampz: selected.toISOString(), // ISO format for timestampz
      });
    }
  };

  // Commented out time selection handler
  /*
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    // Store selection in state only, don't submit
    if (selectedDate && onDataChange) {
      // Update parent component's state without triggering navigation
      onDataChange({ date: selectedDate, time });
    }
  };
  */

  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 gap-8 border border-grey-outline rounded-xl p-4">
        <div>
          <h3 className="font-semibold text-lg mb-4">Select a Date</h3>
          <div className="bg-white rounded-lg border border-grey-outline p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth}>
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-medium">
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button onClick={handleNextMonth}>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay - 1 }).map((_, index) => (
                <div key={`empty-${index}`} className="p-2" />
              ))}
              {Array.from({ length: days }).map((_, index) => {
                const day = index + 1;
                const isSelected =
                  selectedDate?.getDate() === day &&
                  selectedDate?.getMonth() === currentMonth.getMonth();
                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`p-2 text-center rounded-full hover:bg-red-50 ${
                      isSelected ? "bg-primary-orange text-white" : ""
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Time zone
              </label>
              <select className="w-full p-2 border border-grey-outline rounded-md">
                <option>Central European Time (8-11pm)</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Time selection section commented out
        <div>
          <h3 className="font-semibold text-lg mb-4">Select a Time</h3>
          <div className="space-y-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`w-full p-3 text-center border rounded-md transition-all ${
                  selectedTime === time
                    ? "border-primary-orange text-primary-orange bg-red-50"
                    : "border-grey-outline hover:border-primary-orange"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        */}
      </div>
    </motion.div>
  );
};

export default TimeAndDateForm;
