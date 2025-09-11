import { useState, useEffect } from "react";
import { getAllBookings } from "../services/bookingServices";
import { getLogbooksWithEntries } from "../services/logbookservices";

export const useCalendarBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both bookings and logbooks in parallel
        const [bookingsData, logbooksData] = await Promise.all([
          getAllBookings(),
          getLogbooksWithEntries()
        ]);
        
        // console.log("Fetched bookings for calendar:", bookingsData);
        // console.log("Fetched logbooks for calendar:", logbooksData);
        
        setBookings(bookingsData || []);
        setLogbooks(logbooksData || []);
      } catch (err) {
        setError(err);
        console.error("Error fetching data for calendar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  // Format bookings and logbooks for calendar display
  const formatBookingsForCalendar = () => {
    let formattedEvents = [];
    
    // Format assessment bookings
    if (bookings && bookings.length > 0) {
      const formattedBookings = bookings
        .map((booking) => {
          try {
            const assessmentTime = new Date(booking.assessment_time);
            const endTime = new Date(assessmentTime.getTime() + 60 * 60 * 1000); // 1 hour duration

            return {
              id: `assessment-${booking.id}`,
              title: `Assessment - ${booking.properties?.name || "Property"}`,
              start: assessmentTime,
              end: endTime,
              type: "assessment",
              color: "bg-blue-100 text-blue-800 border-blue-200",
              booking: booking,
              // Add string versions of dates for consistent comparison
              startStr: assessmentTime.toISOString(),
              endStr: endTime.toISOString(),
            };
          } catch (err) {
            console.error("Error formatting booking:", booking, err);
            return null;
          }
        })
        .filter(Boolean); // Remove any null entries
      
      formattedEvents = [...formattedEvents, ...formattedBookings];
    }
    
    // Format logbook entries
    if (logbooks && logbooks.length > 0) {
      const formattedLogbooks = logbooks
        .flatMap((logbook) => {
          if (!logbook.logbook_entries || logbook.logbook_entries.length === 0) {
            return [];
          }
          
          return logbook.logbook_entries.map(entry => {
            try {
              const entryTime = new Date(entry.performed_at);
              // Setting time to 10 AM if only date is provided
              if (entryTime.getHours() === 0 && entryTime.getMinutes() === 0) {
                entryTime.setHours(10, 0, 0);
              }
              
              const endTime = new Date(entryTime.getTime() + 30 * 60 * 1000); // 30 min duration
              
              // Determine color based on completion status
              let color = "bg-green-100 text-green-800 border-green-200";
              if (entry.completion_status === "Issue Identified") {
                color = "bg-red-100 text-red-800 border-red-200";
              } else if (entry.completion_status === "Not Completed") {
                color = "bg-yellow-100 text-yellow-800 border-yellow-200";
              }
              
              return {
                id: `logbook-${entry.id}`,
                title: `${logbook.logbook_type} - ${logbook.property?.name || "Property"}`,
                start: entryTime,
                end: endTime,
                type: "logbook",
                color: color,
                logbook: logbook,
                entry: entry,
                property_id: logbook.property_id,
                // Add string versions of dates for consistent comparison
                startStr: entryTime.toISOString(),
                endStr: endTime.toISOString(),
              };
            } catch (err) {
              console.error("Error formatting logbook entry:", entry, err);
              return null;
            }
          });
        })
        .filter(Boolean); // Remove any null entries
      
      formattedEvents = [...formattedEvents, ...formattedLogbooks];
    }
    
    // Sort by date
    formattedEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // console.log("Formatted events for calendar:", formattedEvents);
    return formattedEvents;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const formattedBookings = formatBookingsForCalendar();
    
    // Debug logging
    console.log("Total events in calendar:", formattedBookings.length);
    console.log("Looking for events on date:", date.toDateString());
    
    const filtered = formattedBookings.filter((event) => {
      try {
        // Create new Date objects to ensure proper comparison
        const eventDate = new Date(event.start);
        
        // Compare only the date portions
        const matches =
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear();
        
        return matches;
      } catch (err) {
        console.error("Error filtering event for date:", event, err);
        return false;
      }
    });
    
    // Debug logging
    console.log(`Found ${filtered.length} events for ${date.toDateString()}`);
    return filtered;
  };

  // Helper function to check if an event belongs to a specific day
  const eventBelongsToDay = (event, day) => {
    try {
      // Ensure we're working with proper date objects
      const eventDate = new Date(event.startStr);
      const dayDate = new Date(day);
      
      // Compare only the date parts, not time
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const dayDateOnly = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
      
      const belongs = eventDateOnly.getTime() === dayDateOnly.getTime();
      
      // Debug log
      // console.log(`Checking if event ${event.title} (${eventDateOnly.toDateString()}) belongs to ${dayDateOnly.toDateString()}: ${belongs}`);
      
      return belongs;
    } catch (err) {
      console.error("Error checking if event belongs to day:", event, day, err);
      return false;
    }
  };

  // Get events for a specific day in month view
  const getEventsForDay = (dayNumber, currentDate) => {
    const formattedBookings = formatBookingsForCalendar();
    const filtered = formattedBookings.filter((event) => {
      try {
        // Create a date object for the day we're looking for
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
        const eventDate = new Date(event.startStr);
        
        const matches = 
          eventDate.getDate() === dayNumber &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear();
          
        return matches;
      } catch (err) {
        console.error("Error filtering event for day:", event, err);
        return false;
      }
    });
    
    return filtered;
  };

  return {
    bookings,
    logbooks,
    loading,
    error,
    formatBookingsForCalendar,
    getEventsForDate,
    getEventsForDay,
    eventBelongsToDay,
  };
};
