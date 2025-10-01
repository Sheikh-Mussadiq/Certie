import { MoreVertical, ArrowUp, ArrowDown, ShieldCheck } from "lucide-react";
import { calculateOverallCompliance, calculateMonthlyComplianceComparison } from "../../lib/complianceUtils";

const ComplianceScore = ({ properties, logbooks }) => {
  const averageScore = calculateOverallCompliance(properties);
  
  // Calculate month-over-month comparison
  const monthlyComparison = calculateMonthlyComplianceComparison(properties, logbooks || []);
  const { difference, percentageChange, isImprovement } = monthlyComparison;

  return (
    <div className="bg-white p-4 rounded-xl flex flex-col justify-between">
      <div className="flex flex-row items-center gap-2 mb-12">
        <ShieldCheck size={20} />
        <h3 className="font-semibold text-secondary-black text-lg">
          Compliance Score
        </h3>
         {/* <button className="bg-white p-2 rounded-lg shadow-sm border border-grey-outline text-secondary-black">
          <MoreVertical size={20} />
        </button> */}
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-4xl font-bold">{averageScore}%</span>

        {percentageChange > 0 && (
          <div className={`flex items-center text-sm mt-2 ${
            isImprovement ? 'text-secondary-green' : 'text-red-500'
          }`}>
            <div className={`text-white rounded-full p-1 ${
              isImprovement ? 'bg-secondary-green' : 'bg-red-500'
            }`}>
              {isImprovement ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </div>
            <span className="ml-1">{percentageChange}% </span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceScore;
