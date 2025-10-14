import { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import {
  MoreHorizontal,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Check,
} from "lucide-react";
import Sort from "../../assets/sort-a-z.png";
import Filter from "../../assets/filter.png";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Shimmer from "../ui/Shimmer";
import {
  getPropertyBookings,
  updateBookingStatus,
  cancelBooking,
} from "../../services/bookingServices";
import { supabase } from "../../lib/supabase";

const AssessmentsTab = () => {
  const { property } = useOutletContext();
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sortBy, setSortBy] = useState("assessment_time");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    overdue: 0,
    nextDue: 0,
  });

  // Available sorting options
  const sortOptions = [
    { value: "assessment_time", label: "Assessment Time" },
    { value: "completed_at", label: "Date Completed" },
    { value: "type", label: "Assessment Type" },
    { value: "status", label: "Status" },
  ];

  // Available filter options
  const statusFilterOptions = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "complete", label: "Complete" },
    { value: "overdue", label: "Overdue" },
    { value: "due soon", label: "Due Soon" },
  ];

  // Get unique assessment types for filter dropdown
  const getAssessmentTypes = () => {
    const types = assessments
      .map((assessment) => assessment.type)
      .filter((type) => type) // Filter out undefined/null
      .filter((value, index, self) => self.indexOf(value) === index); // Unique values

    return [
      { value: "", label: "All Types" },
      ...types.map((type) => ({ value: type, label: type })),
    ];
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  useEffect(() => {
    if (propertyId) {
      fetchAssessments();
    }
  }, [propertyId]);

  useEffect(() => {
    // Apply filters and sorting whenever assessment data or filter criteria change
    if (assessments.length > 0) {
      let filtered = [...assessments];

      // Apply status filter
      if (filterStatus) {
        filtered = filtered.filter((assessment) => {
          const status = getAssessmentStatus(assessment);
          return status.toLowerCase() === filterStatus.toLowerCase();
        });
      }

      // Apply type filter
      if (filterType) {
        filtered = filtered.filter(
          (assessment) =>
            assessment.type &&
            assessment.type.toLowerCase() === filterType.toLowerCase()
        );
      }

      // Apply sorting
      filtered = sortAssessments(filtered, sortBy, sortDirection);

      setFilteredAssessments(filtered);
      // Reset to first page when filters change
      setCurrentPage(1);
    }
  }, [assessments, filterStatus, filterType, sortBy, sortDirection]);

  // Function to handle sorting based on field and direction
  const sortAssessments = (data, field, direction) => {
    return [...data].sort((a, b) => {
      let valA, valB;

      // Special handling for status which requires calculation
      if (field === "status") {
        valA = getAssessmentStatus(a);
        valB = getAssessmentStatus(b);
      } else {
        valA = a[field];
        valB = b[field];
      }

      // Handle null/undefined values
      if (valA === null || valA === undefined)
        return direction === "asc" ? -1 : 1;
      if (valB === null || valB === undefined)
        return direction === "asc" ? 1 : -1;

      // Convert dates for comparison
      if (field === "assessment_time" || field === "completed_at") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        // For string comparison
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      // Sort based on direction
      if (direction === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Handle filter change
  const handleStatusFilterChange = (value) => {
    setFilterStatus(value);
  };

  const handleTypeFilterChange = (value) => {
    setFilterType(value);
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const bookingsData = await getPropertyBookings(propertyId);

      // Filter only assessment-related bookings
      // const assessmentBookings = bookingsData.filter(booking =>
      //   booking.type && booking.type.toLowerCase().includes('assessment')
      // );

      setAssessments(bookingsData);
      // Initialize filteredAssessments with the sorted data
      setFilteredAssessments(
        sortAssessments(bookingsData, sortBy, sortDirection)
      );
      calculateStats(bookingsData);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast.error("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (assessmentData) => {
    const now = new Date();
    const total = assessmentData.length;

    let overdue = 0;
    let nextDue = null;
    let nextDueCount = 0;

    assessmentData.forEach((assessment) => {
      // Get the status using the same function used in the table
      const status = getAssessmentStatus(assessment);
      
      // Count overdue items using the same logic as the table
      if (status === "overdue") {
        overdue++;
      }

      if (assessment.completed_at) {
        const completedDate = new Date(assessment.completed_at);
        const nextDueDate = new Date(completedDate);
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);

        // Find the next upcoming due date
        if (nextDueDate > now && (!nextDue || nextDueDate < nextDue)) {
          nextDue = nextDueDate;
        }
      }
    });

    // Count assessments due in the next 30 days
    if (nextDue) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      assessmentData.forEach((assessment) => {
        // Get the status using the same function used in the table
        const status = getAssessmentStatus(assessment);
        
        // Count items that are "due soon"
        if (status === "due soon") {
          nextDueCount++;
        }
      });
    }

    setStats({
      total,
      overdue,
      nextDue: nextDueCount,
    });
  };

  const getNextDueDate = (completedAt) => {
    if (!completedAt) return "N/A";
    const completedDate = new Date(completedAt);
    const nextDue = new Date(completedDate);
    nextDue.setFullYear(nextDue.getFullYear() + 1);
    return nextDue.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAssessmentStatus = (booking) => {
    if (!booking.completed_at) {
      return booking.status || "pending";
    }

    const completedDate = new Date(booking.completed_at);
    const nextDue = new Date(completedDate);
    nextDue.setFullYear(nextDue.getFullYear() + 1);
    const now = new Date();

    if (nextDue < now) {
      return "overdue";
    } else if (nextDue <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
      return "due soon";
    }

    return "complete";
  };

  const isStatusDeletable = (status) => {
    return statusOptions.some(
      (option) => option.value === status.toLowerCase()
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "complete":
      case "completed":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "due soon":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-50 text-red-600";
      case "missing":
        return "bg-gray-100 text-gray-800";
      // Invoice status colors
      case "paid":
        return "bg-primary-green/10 text-primary-green border-primary-green/30";
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "draft":
        return "bg-grey-fill text-primary-grey border-grey-outline";
      case "void":
        return "bg-primary-red/10 text-primary-red border-primary-red/30";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInvoiceStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "open":
        return <Clock className="w-4 h-4" />;
      case "draft":
        return <FileText className="w-4 h-4" />;
      case "void":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getAssigneeInitials = (assignee) => {
    if (!assignee || !assignee.name) return "N/A";
    return assignee.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatAssessmentTime = (assessment_time) => {
    if (!assessment_time) return "Not scheduled";
    return new Date(assessment_time).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async (assessmentId, newStatus) => {
    try {
      await updateBookingStatus(assessmentId, newStatus);

      // Update local state instead of refetching
      setAssessments((prevAssessments) =>
        prevAssessments.map((assessment) =>
          assessment.id === assessmentId
            ? { ...assessment, status: newStatus }
            : assessment
        )
      );

      // Recalculate stats with updated data
      const updatedAssessments = assessments.map((assessment) =>
        assessment.id === assessmentId
          ? { ...assessment, status: newStatus }
          : assessment
      );
      calculateStats(updatedAssessments);

      toast.success("Assessment status updated");

      // If the new status is 'approved', trigger invoice creation.
      if (newStatus === "approved") {
        console.log(`Booking ${assessmentId} approved. Creating invoice...`);
        try {
          const { data: invoiceData, error: invoiceError } =
            await supabase.functions.invoke("create-invoice", {
              body: { bookingIds: [assessmentId] },
            });

          if (invoiceError) {
            throw invoiceError;
          }

          console.log("Invoice created successfully:", invoiceData);
          toast.success("Invoice created for the approved assessment.");
        } catch (error) {
          console.error("Failed to create invoice:", error);
          toast.error(`Failed to create invoice: ${error.message}`);
        }
      }
    } catch (error) {
      console.error("Error updating assessment status:", error);
      toast.error("Failed to update assessment status");
    }
  };

  const handleBookAssessment = () => {
    navigate("/contractor-workflow", {
      state: {
        propertyId: propertyId,
        startAtStep: 2,
      },
    });
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to cancel this assessment?")) {
      return;
    }

    try {
      await cancelBooking(assessmentId);
      await fetchAssessments();
      toast.success("Assessment cancelled");
    } catch (error) {
      console.error("Error cancelling assessment:", error);
      toast.error("Failed to cancel assessment");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssessments = filteredAssessments.slice(startIndex, endIndex);

  const statsData = [
    {
      label: "Total Assessments",
      value: stats.total.toString().padStart(2, "0"),
      // change: "10.2%",
      // isPositive: true,
    },
    {
      label: "Over Due",
      value: stats.overdue.toString().padStart(2, "0"),
      // change: "5.75%",
      // isPositive: false,
    },
    {
      label: "Next Due",
      value: stats.nextDue ? stats.nextDue.toString().padStart(2, "0") : "N/A",
      // change: "5.75%",
      // isPositive: false,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Stats Section Shimmer */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-grey-outline p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <Shimmer className="h-4 w-32" />
                <Shimmer className="h-5 w-5 rounded-full" />
              </div>
              <div className="flex items-end gap-3">
                <Shimmer className="h-8 w-16" />
                <Shimmer className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>

        {/* Actions Bar Shimmer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Shimmer className="h-9 w-24 rounded-lg" />
            <Shimmer className="h-9 w-24 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Shimmer className="h-9 w-40 rounded-lg" />
            <Shimmer className="h-9 w-40 rounded-lg" />
          </div>
        </div>

        {/* Table Shimmer */}
        <div className="bg-white rounded-lg border border-grey-outline overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-grey-fill border-b border-grey-outline">
                <th className="text-left py-4 px-6">
                  <Shimmer className="h-4 w-32" />
                </th>
                <th className="text-left py-4 px-6">
                  <Shimmer className="h-4 w-28" />
                </th>
                <th className="text-left py-4 px-6">
                  <Shimmer className="h-4 w-24" />
                </th>
                <th className="text-left py-4 px-6">
                  <Shimmer className="h-4 w-20" />
                </th>
                <th className="text-left py-4 px-6">
                  <Shimmer className="h-4 w-28" />
                </th>
                <th className="text-left py-4 px-6">
                  <Shimmer className="h-4 w-24" />
                </th>
                <th className="text-left py-4 px-6">
                  <Shimmer className="h-4 w-36" />
                </th>
                <th className="text-left py-4 px-6">
                  <Shimmer className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr
                  key={i}
                  className="border-b border-grey-outline last:border-0"
                >
                  <td className="py-4 px-6">
                    <Shimmer className="h-5 w-36" />
                  </td>
                  <td className="py-4 px-6">
                    <Shimmer className="h-5 w-28" />
                  </td>
                  <td className="py-4 px-6">
                    <Shimmer className="h-5 w-24" />
                  </td>
                  <td className="py-4 px-6">
                    <Shimmer className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Shimmer className="h-8 w-8 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Shimmer className="h-4 w-28" />
                        <Shimmer className="h-3 w-20" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Shimmer className="h-5 w-28" />
                  </td>
                  <td className="py-4 px-6">
                    <Shimmer className="h-5 w-36" />
                  </td>
                  <td className="py-4 px-6">
                    <Shimmer className="h-6 w-6 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Shimmer */}
          <div className="flex justify-between items-center p-4 border-t border-grey-outline">
            <div className="flex items-center gap-2">
              <Shimmer className="h-4 w-12" />
              <Shimmer className="h-8 w-16" />
              <Shimmer className="h-4 w-12" />
            </div>
            <div className="flex items-center gap-2">
              <Shimmer className="h-8 w-8 rounded" />
              <Shimmer className="h-8 w-8 rounded" />
              <Shimmer className="h-8 w-8 rounded" />
              <Shimmer className="h-8 w-8 rounded" />
              <Shimmer className="h-8 w-8 rounded" />
              <Shimmer className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex justify-between bg-white rounded-xl shadow-sm p-4 sm:p-6 relative"
          >
            <div className="flex flex-col justify-between items-start gap-2 sm:gap-4">
              <span className="text-sm sm:text-lg font-semibold text-secondary-black">
                {stat.label}
              </span>
              {/* <button clavssName="text-gray-400 hover:text-gray-600 absolute top-6 right-6 shadow-sm p-2 rounded-lg border border-grey-outline">
                <MoreVertical className="w-5 h-5" />
              </button> */}
              <div className="mt-2 sm:mt-4">
                <div className="flex items-baseline">
                  <span className="text-2xl sm:text-4xl font-bold">{stat.value}</span>
                </div>
              </div>
            </div>
            {/* <div className="flex items-end">
              <span
                className={`text-xs flex items-center gap-1 ${
                  stat.isPositive ? "text-green-600" : "text-primary-orange"
                }`}
              >
                {stat.isPositive ? (
                  <ArrowUp className="w-5 h-5 text-white bg-secondary-green rounded-full p-1" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-white bg-primary-orange rounded-full p-1" />
                )}

                {stat.change}
                <span className="text-xs text-primary-grey">vs last month</span>
              </span>
            </div> */}
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="space-y-4 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* Sort Dropdown */}
            <div className="relative">
              <Listbox value={sortBy} onChange={handleSortChange}>
                <div className="relative">
                  <Listbox.Button className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-primary-black rounded-lg border border-grey-outline shadow-sm whitespace-nowrap">
                    <img src={Sort} alt="sort" className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Sort</span>
                    {/* Only show badge if not using default sort option (assessment_time) */}
                    {sortBy !== "assessment_time" && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-orange text-xs font-bold text-white">
                        1
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSortDirection();
                      }}
                      className="ml-1"
                    >
                      {sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </button>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dropdown-scroll">
                      {sortOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active }) =>
                            `${
                              active
                                ? "bg-primary-orange/10 text-primary-orange rounded-md"
                                : "text-gray-700"
                            }
                            cursor-pointer select-none relative py-2 pl-3 pr-9`
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {option.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-orange">
                                  <Check
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Filter Status Dropdown */}
            <div className="relative">
              <Listbox value={filterStatus} onChange={handleStatusFilterChange}>
                <div className="relative">
                  <Listbox.Button className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-primary-black rounded-lg border border-grey-outline shadow-sm whitespace-nowrap">
                    <img src={Filter} alt="filter" className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Status</span>
                    {/* Only show badge if a status filter is applied (not the default empty string) */}
                    {filterStatus && filterStatus !== "" && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-orange text-xs font-bold text-white">
                        1
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dropdown-scroll">
                      {statusFilterOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active }) =>
                            `${
                              active
                                ? "bg-primary-orange/10 text-primary-orange rounded-md"
                                : "text-gray-700"
                            }
                            cursor-pointer select-none relative py-2 pl-3 pr-9`
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {option.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-orange">
                                  <Check
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Filter Type Dropdown */}
            <div className="relative">
              <Listbox value={filterType} onChange={handleTypeFilterChange}>
                <div className="relative">
                  <Listbox.Button className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-primary-black rounded-lg border border-grey-outline shadow-sm whitespace-nowrap">
                    <img src={Filter} alt="filter" className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Type</span>
                    {/* Only show badge if a type filter is applied (not the default empty string) */}
                    {filterType && filterType !== "" && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-orange text-xs font-bold text-white">
                        1
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dropdown-scroll">
                      {getAssessmentTypes().map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active }) =>
                            `${
                              active
                                ? "bg-primary-orange/10 text-primary-orange rounded-md"
                                : "text-gray-700"
                            }
                            cursor-pointer select-none relative py-2 pl-3 pr-9`
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {option.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-orange">
                                  <Check
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary-black rounded-lg hover:bg-primary-black/90">
            <Plus className="w-4 h-4" />
            Add New Assessment
          </button> */}
            {(currentUser.id === property.owner_id ||
              property.managers?.some(
                (manager) => manager.user_id === currentUser.id
              )) && (
              <button
                onClick={handleBookAssessment}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-primary-black rounded-lg hover:bg-primary-black/90 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Book Assessment</span>
                <span className="sm:hidden">Book</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-grey-fill">
              <tr className="border-b border-grey-outline">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-r border-grey-outline">
                  Assessment Type
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-r border-grey-outline">
                  Date Completed
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-r border-grey-outline">
                  Next Due
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-r border-grey-outline">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-r border-grey-outline">
                  Assignee
                </th>
                {currentUser?.id === property.owner_id && (
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-r border-grey-outline">
                    Invoice
                  </th>
                )}
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey">
                  Assessment Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-outline">
              {currentAssessments.length > 0 ? (
                currentAssessments.map((assessment) => {
                  const status = getAssessmentStatus(assessment);
                  const assignee = assessment.assignee || {};
                  console.log("Assessment Data:", assessment);

                  return (
                    <tr key={assessment.id} className="hover:bg-grey-fill/50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 border-r border-grey-outline text-xs sm:text-sm text-secondary-black font-medium">
                        {assessment.type || "Assessment"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 border-r border-grey-outline text-xs sm:text-sm">
                        {assessment.completed_at
                          ? new Date(
                              assessment.completed_at
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Not completed"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 border-r border-grey-outline text-xs sm:text-sm">
                        {getNextDueDate(assessment.completed_at)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 border-r border-grey-outline">
                        {currentUser?.id === property.owner_id &&
                        (status === "pending" ||
                          (status === "approved" &&
                            (!assessment.invoice_bookings ||
                              assessment.invoice_bookings.length === 0)) ||
                          status === "rejected") ? (
                          <select
                            value={status}
                            onChange={(e) =>
                              handleStatusUpdate(assessment.id, e.target.value)
                            }
                            className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${getStatusColor(
                              status
                            )}`}
                            disabled={status === "approved"}
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              status
                            )}`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 border-r border-grey-outline text-left">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-orange text-white flex items-center justify-center text-xs font-medium">
                              {getAssigneeInitials(assignee)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {assignee.name}
                              </span>
                              <span className="text-xs text-gray-800">
                                {assignee.email}
                              </span>
                              <span className="text-xs text-gray-800">
                                {assignee.contact}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      {currentUser?.id === property.owner_id && (
                        <td className="px-3 sm:px-6 py-3 sm:py-4 border-r border-grey-outline">
                          {assessment.invoice_bookings &&
                          assessment.invoice_bookings.length > 0 ? (
                            <div>
                              <div className="mb-2">
                                <span
                                  className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md border ${getStatusColor(
                                    assessment.invoice_bookings[0].invoices
                                      .status
                                  )}`}
                                >
                                  {getInvoiceStatusIcon(
                                    assessment.invoice_bookings[0].invoices
                                      .status
                                  )}
                                  {assessment.invoice_bookings[0].invoices.status
                                    .charAt(0)
                                    .toUpperCase() +
                                    assessment.invoice_bookings[0].invoices.status.slice(
                                      1
                                    )}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                £
                                {assessment.invoice_bookings[0].invoices
                                  .amount_due / 100}
                              </p>
                              <a
                                href={
                                  assessment.invoice_bookings[0].invoices
                                    .hosted_invoice_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline"
                              >
                                View Invoice
                              </a>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      )}
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        {formatAssessmentTime(assessment.assessment_time)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-grey-fill rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No assessments found
                      </h3>
                      {(currentUser.id === property.owner_id ||
                        property.managers?.some(
                          (manager) => manager.user_id === currentUser.id
                        )) && (
                        <>
                          <p className="text-gray-500 mb-4">
                            Get started by booking your first assessment
                          </p>
                          <button
                            onClick={handleBookAssessment}
                            className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors"
                          >
                            Book Assessment
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {assessments.length > itemsPerPage && (
            <div className="flex flex-wrap justify-between items-center gap-3 p-3 sm:p-4 border-t border-grey-outline">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-secondary-black">
                  Show
                </span>
                <select
                  className="px-2 py-1 border border-grey-outline rounded-md text-xs sm:text-sm focus:outline-none focus:ring-primary-black focus:border-primary-black"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-grey-outline text-primary-grey hover:bg-grey-fill disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md border border-grey-outline hover:bg-grey-fill ${
                        currentPage === pageNum
                          ? "bg-grey-fill text-primary-black"
                          : "bg-white text-primary-grey"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-primary-grey">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 rounded-md border border-grey-outline hover:bg-grey-fill ${
                        currentPage === totalPages
                          ? "bg-grey-fill text-primary-black"
                          : "bg-white text-primary-grey"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-grey-outline text-primary-grey hover:bg-grey-fill disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentsTab;
