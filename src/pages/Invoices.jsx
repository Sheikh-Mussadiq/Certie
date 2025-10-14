import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  ChevronRight,
} from "lucide-react";
import { getInvoicesForUser } from "../services/invoiceServices";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Shimmer from "../components/ui/Shimmer";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const { currentUser } = useAuth();

  const statusOptions = [
    { value: "all", label: "All Status", icon: <Filter className="w-4 h-4" /> },
    { value: "paid", label: "Paid", icon: <CheckCircle className="w-4 h-4" /> },
    { value: "open", label: "Pending", icon: <Clock className="w-4 h-4" /> },
    { value: "draft", label: "Draft", icon: <FileText className="w-4 h-4" /> },
    { value: "void", label: "Void", icon: <AlertCircle className="w-4 h-4" /> },
  ];

  const getCurrentStatusOption = () => {
    return (
      statusOptions.find((option) => option.value === statusFilter) ||
      statusOptions[0]
    );
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userInvoices = await getInvoicesForUser();
        setInvoices(userInvoices);
        setError(null);
      } catch (err) {
        setError("Failed to fetch invoices. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isStatusDropdownOpen && !event.target.closest(".status-dropdown")) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice) => {
      const matchesSearch = invoice.stripe_invoice_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "amount_due") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === "created_at" || sortBy === "due_date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Calculate stats
  const stats = {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === "paid").length,
    pending: invoices.filter((inv) => inv.status === "open").length,
    overdue: invoices.filter((inv) => {
      if (inv.status === "open" && inv.due_date) {
        return new Date(inv.due_date) < new Date();
      }
      return false;
    }).length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-primary-green/10 text-primary-green border-primary-green/30";
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "draft":
        return "bg-grey-fill text-primary-grey border-grey-outline";
      case "void":
        return "bg-primary-red/10 text-primary-red border-primary-red/30";
      default:
        return "bg-grey-fill text-primary-grey border-grey-outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <SortAsc className="w-4 h-4 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-8">
        {/* Stats Section Shimmer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
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
            <Shimmer className="h-9 w-64 rounded-lg" />
            <Shimmer className="h-9 w-24 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Shimmer className="h-9 w-40 rounded-lg" />
            <Shimmer className="h-9 w-40 rounded-lg" />
          </div>
        </div>

        {/* Table Shimmer */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                    <Shimmer className="h-5 w-28" />
                  </td>
                  <td className="py-4 px-6">
                    <Shimmer className="h-6 w-6 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-semibold text-secondary-black">
            Invoices
          </h1>
          <p className="text-xs sm:text-sm text-primary-grey mt-1">
            Manage and track all your property-related invoices and payment
            statuses
          </p>
        </div>
        {/* <div className="flex gap-3">
          <button className="px-4 py-2 border border-grey-outline rounded-lg text-primary-black hover:bg-grey-fill transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div> */}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <span className="text-sm sm:text-base font-semibold text-secondary-black">
              Total Invoices
            </span>
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-grey" />
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-secondary-black">
                {stats.total}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <span className="text-sm sm:text-base font-semibold text-secondary-black">
              Paid
            </span>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-green" />
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-primary-green">
                {stats.paid}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <span className="text-sm sm:text-base font-semibold text-secondary-black">
              Pending
            </span>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                {stats.pending}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <span className="text-sm sm:text-base font-semibold text-secondary-black">
              Overdue
            </span>
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-red" />
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-primary-red">
                {stats.overdue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm overflow-visible relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="relative status-dropdown">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 border border-grey-outline rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-transparent hover:bg-grey-fill transition-colors whitespace-nowrap"
              >
                {getCurrentStatusOption().icon}
                <span className="text-primary-black hidden sm:inline">
                  {getCurrentStatusOption().label}
                </span>
                <span className="text-primary-black sm:hidden">
                  {getCurrentStatusOption().value === "all"
                    ? "All"
                    : getCurrentStatusOption().label}
                </span>
                <ChevronDown
                  className={`w-3 h-3 sm:w-4 sm:h-4 text-primary-grey transition-transform ${
                    isStatusDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isStatusDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-grey-outline rounded-lg shadow-lg z-20"
                >
                  <div className="p-1">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-grey-fill transition-colors ${
                          statusFilter === option.value
                            ? "text-primary-black bg-grey-fill"
                            : "text-primary-grey"
                        }`}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                        {statusFilter === option.value && (
                          <ChevronRight className="w-4 h-4 ml-auto text-primary-black" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-grey" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-grey-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-black focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex flex-col">
          {/* Scrollable Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <thead className="bg-grey-fill sticky top-0 z-10">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-t border-b border-l border-grey-outline">
                    <button
                      onClick={() => handleSort("stripe_invoice_id")}
                      className="flex items-center gap-1 sm:gap-2 hover:text-primary-black transition-colors"
                    >
                      Invoice ID
                      <SortIcon field="stripe_invoice_id" />
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-t border-b border-grey-outline">
                    <button
                      onClick={() => handleSort("amount_due")}
                      className="flex items-center gap-1 sm:gap-2 hover:text-primary-black transition-colors"
                    >
                      Amount
                      <SortIcon field="amount_due" />
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-t border-b border-grey-outline">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-1 sm:gap-2 hover:text-primary-black transition-colors"
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-t border-b border-grey-outline">
                    <button
                      onClick={() => handleSort("due_date")}
                      className="flex items-center gap-1 sm:gap-2 hover:text-primary-black transition-colors"
                    >
                      Due Date
                      <SortIcon field="due_date" />
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-t border-b border-grey-outline">
                    <button
                      onClick={() => handleSort("created_at")}
                      className="flex items-center gap-1 sm:gap-2 hover:text-primary-black transition-colors"
                    >
                      Created
                      <SortIcon field="created_at" />
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-primary-grey border-t border-b border-r border-grey-outline">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-outline">
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-grey-fill/50"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-secondary-black">
                        #{invoice.stripe_invoice_id.substring(0, 8)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          {formatCurrency(invoice.amount_due)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs font-medium rounded-md border ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getStatusIcon(invoice.status)}
                          <span className="hidden sm:inline">
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        {invoice.due_date
                          ? formatDate(invoice.due_date)
                          : "N/A"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        {formatDate(invoice.created_at)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <a
                            href={invoice.hosted_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          {invoice.invoice_pdf && (
                            <a
                              href={invoice.invoice_pdf}
                              download
                              className="p-2 text-primary-grey hover:bg-grey-fill rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-primary-grey"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-grey-fill rounded-full flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-primary-grey" />
                        </div>
                        <h3 className="text-lg font-medium text-secondary-black mb-2">
                          No invoices found
                        </h3>
                        <p className="text-primary-grey">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "You don't have any invoices yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Fixed Pagination Footer */}
          {filteredInvoices.length > itemsPerPage && (
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
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-grey-outline text-primary-grey hover:bg-grey-fill disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
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
                    setCurrentPage(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-grey-outline text-primary-grey hover:bg-grey-fill disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 -rotate-90" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
