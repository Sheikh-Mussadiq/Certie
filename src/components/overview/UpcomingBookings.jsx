import { format } from "date-fns";
import { useEffect } from "react";
import { MoreVertical, Calendar } from "lucide-react";
import ListAltIcon from "@mui/icons-material/ListAlt";

const UpcomingBookings = ({ bookings }) => {
  const upcoming = bookings
    .filter((b) => {
      // const assessmentDate = new Date(b.assessment_time);
      // const now = new Date();
      // const sevenDaysFromNow = new Date(
      //   now.getTime() + 7 * 24 * 60 * 60 * 1000
      // );

      return (
        b.status === "assigned"
        // assessmentDate > now &&
        // assessmentDate <= sevenDaysFromNow
      );
    })
    .sort((a, b) => new Date(a.assessment_time) - new Date(b.assessment_time));

  useEffect(() => {
    console.log(bookings);
  }, [bookings]);

  useEffect(() => {
    console.log("upcoming", upcoming);
  }, [upcoming]);

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-secondary-black text-lg">
          Upcoming Bookings
        </h3>
        <button className="bg-white p-2 rounded-lg shadow-sm border border-grey-outline text-secondary-black">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="space-y-4">
        {upcoming.length > 0 ? (
          upcoming.map((booking, index) => (
            <div
              key={booking.id || index}
              className="flex items-center p-2 rounded-lg bg-grey-fill"
            >
              <div className="bg-gray-100 p-2 rounded-lg mr-4">
                <ListAltIcon size={20} className="text-primary-grey" />
              </div>
              <div className="flex-grow">
                <p className="font-semibold">{booking.type}</p>
                <p className="text-sm text-gray-500">
                  {booking.properties?.name}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(booking.assessment_time), "dd MMM - yyyy")}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No upcoming bookings.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingBookings;
