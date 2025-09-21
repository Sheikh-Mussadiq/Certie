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
    <div className="bg-white p-4 rounded-xl flex flex-col justify-between">
      <div className="flex justify-between items-center mb-12">
        <h3 className="font-semibold text-secondary-black text-lg">
          Compliance Score
        </h3>
        {/* <button className="bg-white p-2 rounded-lg shadow-sm border border-grey-outline text-secondary-black">
          <MoreVertical size={20} />
        </button> */}
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-4xl font-bold">{Math.round(averageScore)}%</span>

        <div className="flex items-center text-sm text-secondary-green mt-2">
          <div className="bg-secondary-green text-white rounded-full p-1">
            <ArrowUp size={16} />
          </div>
          <span className="ml-1">10.2% </span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default ComplianceScore;
