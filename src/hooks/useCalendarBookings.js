import { useState, useEffect } from "react";
import { getAllBookings } from "../services/bookingServices";

export const useCalendarBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllBookings();
        // console.log("Fetched bookings for calendar:", data);
        setBookings(data || []);
      } catch (err) {
        setError(err);
        console.error("Error fetching bookings for calendar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Format bookings for calendar display
  const formatBookingsForCalendar = () => {
    if (!bookings || bookings.length === 0) {
      console.log("No bookings available for calendar");
      return [];
    }

    const formatted = bookings
      .map((booking) => {
        try {
          const assessmentTime = new Date(booking.assessment_time);
          const endTime = new Date(assessmentTime.getTime() + 60 * 60 * 1000); // 1 hour duration

          return {
            id: booking.id,
            title: `Assessment - ${booking.properties?.name || "Property"}`,
            start: assessmentTime,
            end: endTime,
            type: "assessment",
            color: "bg-blue-100 text-blue-800 border-blue-200",
            booking: booking,
          };
        } catch (err) {
          console.error("Error formatting booking:", booking, err);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries

    // console.log("Formatted bookings for calendar:", formatted);
    return formatted;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const formattedBookings = formatBookingsForCalendar();
    const filtered = formattedBookings.filter((event) => {
      try {
        const eventDate = new Date(event.start);
        const matches =
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear();
        // console.log(
        //   `Checking event ${
        //     event.title
        //   } for date ${date.toDateString()}: ${matches}`
        // );
        return matches;
      } catch (err) {
        console.error("Error filtering event for date:", event, err);
        return false;
      }
    });
    // console.log(`Events for ${date.toDateString()}:`, filtered);
    return filtered;
  };

  // Get events for a specific day in month view
  const getEventsForDay = (dayNumber, currentDate) => {
    const formattedBookings = formatBookingsForCalendar();
    const filtered = formattedBookings.filter((event) => {
      try {
        const eventDate = new Date(event.start);
        const matches =
          eventDate.getDate() === dayNumber &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear();
        // console.log(
        //   `Checking event ${
        //     event.title
        //   } for day ${dayNumber} in ${currentDate.toDateString()}: ${matches}`
        // );
        return matches;
      } catch (err) {
        console.error("Error filtering event for day:", event, err);
        return false;
      }
    });
    // console.log(
    //   `Events for day ${dayNumber} in ${currentDate.toDateString()}:`,
    //   filtered
    // );
    return filtered;
  };

  return {
    bookings,
    loading,
    error,
    formatBookingsForCalendar,
    getEventsForDate,
    getEventsForDay,
  };
};
