import { MoreVertical, ArrowUp } from "lucide-react";

const ComplianceScore = ({ properties }) => {
  const averageScore =
    properties.length > 0
      ? properties.reduce(
          (acc, property) => acc + (property.compliance_score || 0),
          0
        ) / properties.length
      : 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-700">Compliance Score</h3>
        <button className="bg-white p-2 rounded-lg shadow-sm border border-grey-outline text-primary-black">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="flex items-baseline">
        <span className="text-5xl font-bold">{Math.round(averageScore)}%</span>
      </div>
      <div className="flex items-center text-sm text-green-500 mt-2">
        <ArrowUp size={16} className="mr-1" />
        <span>10.2%</span>
        <span className="text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );
};

export default ComplianceScore;
