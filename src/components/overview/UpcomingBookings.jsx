import { format } from "date-fns";
import { useEffect } from "react";
import { MoreVertical, Calendar, ArrowRight } from "lucide-react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";

const UpcomingBookings = ({ bookings }) => {
  const navigate = useNavigate();

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

  const handleBookingClick = () => {
    navigate("/bookings");
  };

  const handleViewAllClick = () => {
    navigate("/bookings");
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-secondary-black text-lg">
          Upcoming Bookings
        </h3>
        <button
          onClick={handleViewAllClick}
          className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-sm border border-grey-outline text-secondary-black hover:bg-grey-fill transition-colors text-sm"
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {upcoming.length > 0 ? (
          upcoming.map((booking, index) => (
            <div
              key={booking.id || index}
              onClick={handleBookingClick}
              className="flex items-center p-3 rounded-lg bg-grey-fill/50 hover:bg-grey-fill cursor-pointer transition-all duration-200 hover:shadow-md"
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
              <span className="text-sm bg-grey-fill border border-grey-outline px-2 py-1 rounded-lg text-secondary-black">
                {format(new Date(booking.assessment_time), "dd MMM - yyyy")}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <Calendar className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500">No upcoming bookings.</p>
            <button
              onClick={handleViewAllClick}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View all bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingBookings;
