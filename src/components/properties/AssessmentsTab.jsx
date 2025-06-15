import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
} from "lucide-react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Shimmer from "../ui/Shimmer";
import {
  getPropertyBookings,
  updateBookingStatus,
  cancelBooking,
} from "../../services/bookingServices";

const AssessmentsTab = () => {
  const { property } = useOutletContext();
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sortBy, setSortBy] = useState("assessment_time");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    overdue: 0,
    nextDue: 0,
  });

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
  ];

  useEffect(() => {
    if (propertyId) {
      fetchAssessments();
    }
  }, [propertyId]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const bookingsData = await getPropertyBookings(propertyId);

      // Filter only assessment-related bookings
      // const assessmentBookings = bookingsData.filter(booking =>
      //   booking.type && booking.type.toLowerCase().includes('assessment')
      // );

      setAssessments(bookingsData);
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
      if (assessment.completed_at) {
        const completedDate = new Date(assessment.completed_at);
        const nextDueDate = new Date(completedDate);
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);

        if (nextDueDate < now && assessment.status !== "completed") {
          overdue++;
        }

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
        if (assessment.completed_at) {
          const completedDate = new Date(assessment.completed_at);
          const nextDueDate = new Date(completedDate);
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);

          if (nextDueDate >= now && nextDueDate <= thirtyDaysFromNow) {
            nextDueCount++;
          }
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
      case "missing":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      await fetchAssessments();
      toast.success("Assessment status updated");
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
  const totalPages = Math.ceil(assessments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssessments = assessments.slice(startIndex, endIndex);

  const statsData = [
    {
      label: "Total Assessments",
      value: stats.total.toString().padStart(2, "0"),
      change: "+10.2%",
      isPositive: true,
    },
    {
      label: "Over Due",
      value: stats.overdue.toString().padStart(2, "0"),
      change: "5.75%",
      isPositive: false,
    },
    {
      label: "Due Soon (30 days)",
      value: stats.nextDue.toString().padStart(2, "0"),
      change: "5.75%",
      isPositive: false,
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
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-grey-outline p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-primary-grey">{stat.label}</span>
              <button className="text-primary-grey hover:text-primary-black">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-semibold">{stat.value}</span>
              <span
                className={`text-xs ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.isPositive ? "+" : ""}
                {stat.change} vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-primary-black hover:bg-grey-fill rounded-lg">
              <span>Sort by</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-primary-black hover:bg-grey-fill rounded-lg">
            <span>Filter</span>
            <ChevronDown className="w-4 h-4" />
          </button>
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
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary-black rounded-lg hover:bg-primary-black/90"
            >
              <Plus className="w-4 h-4" />
              Book Assessment
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-grey-outline overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-grey-fill border-b border-grey-outline">
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Assessment Type
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Date Completed
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Next Due
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Assignee
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Document
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Assessment Time
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAssessments.length > 0 ? (
              currentAssessments.map((assessment) => {
                const status = getAssessmentStatus(assessment);
                const assignee = assessment.assignee || {};
                console.log("Assessment Data:", assessment);

                return (
                  <tr
                    key={assessment.id}
                    className="border-b border-grey-outline last:border-0 hover:bg-grey-fill/50"
                  >
                    <td className="py-4 px-6 text-sm font-medium">
                      {assessment.type || "Assessment"}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {assessment.completed_at
                        ? new Date(assessment.completed_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Not completed"}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {getNextDueDate(assessment.completed_at)}
                    </td>
                    <td className="py-4 px-6">
                      {currentUser?.id === property.owner_id &&
                      (status === "pending" || status === "approved") ? (
                        <select
                          value={status}
                          onChange={(e) =>
                            handleStatusUpdate(assessment.id, e.target.value)
                          }
                          className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${getStatusColor(
                            status
                          )}`}
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
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-orange text-white flex items-center justify-center text-xs font-medium">
                          {assignee.avatar ? (
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getAssigneeInitials(assignee)
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {assignee.name || "Unassigned"}
                          </span>
                          {assignee.contact && (
                            <span className="text-xs text-primary-grey">
                              {assignee.contact}
                            </span>
                          )}
                          <span className="text-xs text-primary-grey">
                            {assignee.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-sm text-primary-orange hover:underline">
                        {assessment.status === "completed" &&
                        assessment.completed_at
                          ? "View Document"
                          : "N/A"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {formatAssessmentTime(assessment.assessment_time)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {isStatusDeletable(status) && (
                          <button
                            onClick={() =>
                              handleDeleteAssessment(assessment.id)
                            }
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Cancel Assessment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-500">
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
          <div className="flex justify-between items-center p-4 border-t border-grey-outline">
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary-grey">Show</span>
              <select
                className="px-2 py-1 border border-grey-outline rounded text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-primary-grey">items</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 text-primary-grey hover:text-primary-black disabled:text-gray-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                      pageNum === currentPage
                        ? "bg-primary-orange text-white"
                        : "text-primary-black hover:bg-grey-fill"
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
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                      totalPages === currentPage
                        ? "bg-primary-orange text-white"
                        : "text-primary-black hover:bg-grey-fill"
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
                className="p-1 text-primary-grey hover:text-primary-black disabled:text-gray-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentsTab;
