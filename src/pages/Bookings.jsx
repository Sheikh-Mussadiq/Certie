import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import BookingList from "../components/bookings/BookingList";
import BookingFilters from "../components/bookings/BookingFilters";
import BookingPagination from "../components/bookings/BookingPagination";
import { getAllBookings } from "../services/bookingServices";
import BookingListShimmer from "../components/bookings/shimmers/BookingListShimmer";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getAllBookings();
        const filteredData = data.filter(booking => booking.status !== "pending" && booking.status !== "rejected");
        setBookings(filteredData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch bookings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      (booking.type &&
        booking.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.service_name &&
        booking.service_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (booking.properties?.name &&
        booking.properties.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (booking.property_name &&
        booking.property_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-black">Bookings</h1>
        {/* <button className="bg-primary-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition-colors">
          <Plus className="h-5 w-5 mr-1" />
          <span>New Booking</span>
        </button> */}
      </div>

      <BookingFilters onSearch={handleSearch} />

      {loading ? (
        <BookingListShimmer />
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          <BookingList bookings={paginatedBookings} />
          <BookingPagination
            currentPage={currentPage}
            totalItems={filteredBookings.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </>
      )}
    </motion.div>
  );
};

export default Bookings;
