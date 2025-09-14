import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import BookingList from "../components/bookings/BookingList";
import BookingFilters from "../components/bookings/BookingFilters";
import BookingPagination from "../components/bookings/BookingPagination";
import { getAllBookings } from "../services/bookingServices";
import BookingListShimmer from "../components/bookings/shimmers/BookingListShimmer";
import { useAuth } from "../context/AuthContext";
import PropertySelectionModal from "../components/bookings/PropertySelectionModal";

const Bookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("booked_time_desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      const filteredData = data.filter(
        (booking) =>
          booking.status !== "pending" && booking.status !== "rejected"
      );
      setBookings(filteredData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingUpdate = (updatedBooking) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const processedBookings = useMemo(() => {
    let filtered = bookings;

    if (filterStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          (booking.type &&
            booking.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (booking.service_name &&
            booking.service_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (booking.property_name &&
            booking.property_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "booked_time_desc":
          return new Date(b.booked_time) - new Date(a.booked_time);
        case "booked_time_asc":
          return new Date(a.booked_time) - new Date(b.booked_time);
        case "created_at_desc":
          return new Date(b.created_at) - new Date(a.created_at);
        case "created_at_asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "property_name_asc":
          return a.property_name.localeCompare(b.property_name);
        case "property_name_desc":
          return b.property_name.localeCompare(a.property_name);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return sorted;
  }, [bookings, searchQuery, sortOption, filterStatus]);

  const paginatedBookings = processedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary-black">Bookings</h1>
          {currentUser?.role === "super_admin" ? (
            <p className="text-sm text-primary-grey">
              Manage all the bookings for Certie customers.
              <span className="font-bold text-primary-black">
                {" "}
                Please make sure to upload the assessment report for each booking
                once completed. You can also cancel bookings if needed.
              </span>
            </p>
          ) : (
            <p className="text-sm text-primary-grey">
              View and manage your property assessments. Book new assessments, track their status, and access completed reports all in one place.
            </p>
          )}
        </div>
        {currentUser?.role !== "super_admin" && <button 
          onClick={() => setShowPropertyModal(true)}
          className="bg-primary-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition-colors"
        >
          <Plus className="h-5 w-5 mr-1" />
          <span>Book Assessment</span>
        </button>}
      </div>

      {/* Property Selection Modal */}
      <PropertySelectionModal 
        isOpen={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
      />

      <div className="bg-white rounded-xl border border-grey-outline shadow-sm p-4">
        <BookingFilters
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          sortOption={sortOption}
          filterStatus={filterStatus}
        />

        {loading ? (
          <BookingListShimmer />
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <>
            <BookingList
              bookings={paginatedBookings}
              onBookingUpdate={handleBookingUpdate}
            />
            <BookingPagination
              currentPage={currentPage}
              totalItems={processedBookings.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Bookings;
