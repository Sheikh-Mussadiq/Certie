import { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AssessmentsTab = () => {
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const stats = [
    {
      label: "Total Assessments",
      value: "04",
      change: "+10.2%",
      isPositive: true,
    },
    { label: "Over Due", value: "01", change: "5.75%", isPositive: false },
    { label: "Next Due", value: "N/A", change: "5.75%", isPositive: false },
  ];

  const assessments = [
    {
      type: "Lift Inspection",
      dateCompleted: "17 March - 2024",
      nextDue: "17 March - 2024",
      status: "Due Soon",
      performedBy: "Acme Compliance",
      document: null,
      reminder: true,
    },
    {
      type: "Asbestos Report",
      dateCompleted: "17 March - 2024",
      nextDue: "17 March - 2024",
      status: "Complete",
      performedBy: "Budi Santoso",
      document: "report.pdf",
      reminder: false,
    },
    {
      type: "Legionella Survey",
      dateCompleted: "17 March - 2024",
      nextDue: "17 March - 2024",
      status: "Overdue",
      performedBy: "Clara Kusuma",
      document: "survey.pdf",
      reminder: true,
    },
    {
      type: "Fire Risk Assessment",
      dateCompleted: "17 March - 2024",
      nextDue: "17 March - 2024",
      status: "Missing",
      performedBy: "Dewi Ayu Lestari",
      document: null,
      reminder: false,
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "due soon":
        return "bg-orange-100 text-orange-800";
      case "missing":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
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
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary-black rounded-lg hover:bg-primary-black/90">
            <Plus className="w-4 h-4" />
            Add New Assessment
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary-orange rounded-lg hover:bg-primary-orange/90">
            <Plus className="w-4 h-4" />
            Book Assessment
          </button>
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
                Performed By
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Document
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-primary-grey">
                Reminders
              </th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment, index) => (
              <tr
                key={index}
                className="border-b border-grey-outline last:border-0"
              >
                <td className="py-4 px-6 text-sm">{assessment.type}</td>
                <td className="py-4 px-6 text-sm">
                  {assessment.dateCompleted}
                </td>
                <td className="py-4 px-6 text-sm">{assessment.nextDue}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      assessment.status
                    )}`}
                  >
                    {assessment.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-orange text-white flex items-center justify-center text-xs">
                      {assessment.performedBy.charAt(0)}
                    </div>
                    <span className="text-sm">{assessment.performedBy}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button className="text-sm text-primary-orange hover:underline">
                    {assessment.document ? "View Document" : "Upload Document"}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <div className="w-12 h-6 rounded-full bg-grey-fill relative cursor-pointer">
                    <div
                      className={`absolute w-5 h-5 rounded-full top-0.5 transition-all ${
                        assessment.reminder
                          ? "bg-primary-orange right-0.5"
                          : "bg-gray-400 left-0.5"
                      }`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t border-grey-outline">
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary-grey">Show</span>
            <select className="px-2 py-1 border border-grey-outline rounded text-sm">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-primary-grey">items</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 text-primary-grey hover:text-primary-black disabled:text-gray-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[1, 2, 3, "...", 6].map((page, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                  page === 1
                    ? "bg-primary-orange text-white"
                    : "text-primary-black hover:bg-grey-fill"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="p-1 text-primary-grey hover:text-primary-black">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsTab;
