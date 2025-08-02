import {
  ListChecks,
  AlertTriangle,
  ChevronsDown,
  ClipboardList,
  MapPin,
} from "lucide-react";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { useNavigate } from "react-router-dom";

const InfoItem = ({ icon: Icon, label, value, onClick, clickable = false }) => (
  <div
    className={`flex items-start text-sm ${
      clickable
        ? "hover:bg-grey-fill/50 cursor-pointer transition-colors p-1 rounded"
        : ""
    }`}
    onClick={clickable ? onClick : undefined}
  >
    <div className="flex-shrink-0 w-8 text-center">
      <Icon className="w-5 h-5 text-gray-500 inline-block" />
    </div>
    <div className="ml-2">
      <span className="text-gray-700">{label}: </span>
      <span className="font-semibold">{value}</span>
    </div>
  </div>
);

const ImportantInformation = ({ properties, logbooks, bookings }) => {
  const navigate = useNavigate();

  const totalProperties = properties.length;
  const sitesWithIssues = new Set(
    logbooks
      .flatMap((lb) =>
        (lb.logbook_entries || [])
          .filter((e) => e.completion_status === "Issue Identified")
          .map((e) => lb.property_id)
      )
      .filter(Boolean)
  ).size;

  const lowestCompliance =
    properties.length > 0
      ? Math.min(...properties.map((p) => p.compliance_score || 100))
      : 0;
  const lowestComplianceProperty = properties.find(
    (p) => p.compliance_score === lowestCompliance
  );

  // Calculate average compliance score
  const averageCompliance =
    properties.length > 0
      ? Math.round(
          properties.reduce((acc, p) => acc + (p.compliance_score || 0), 0) /
            properties.length
        )
      : 0;

  const totalOpenTasks = bookings.filter(
    (booking) => booking.status !== "completed"
  ).length;

  const fireStation =
    properties.length > 0 ? properties[0].local_fire_station : "N/A";

  const handlePropertiesClick = () => {
    navigate("/properties");
  };

  const handleIssuesClick = () => {
    navigate("/properties");
  };

  const handleComplianceClick = () => {
    navigate("/properties");
  };

  const handleLowestComplianceClick = () => {
    if (lowestComplianceProperty) {
      navigate(`/properties/${lowestComplianceProperty.id}`);
    }
  };

  const handleTasksClick = () => {
    navigate("/bookings");
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-grey-fill border border-grey-outline mr-2">
          <ChecklistIcon size={20} className="text-primary-grey" />
        </div>
        <h3 className="font-semibold text-lg text-secondary-black">
          Important Information
        </h3>
      </div>
      <div className="space-y-3 text-sm">
        <InfoItem
          icon={ListChecks}
          label="Total Properties"
          value={totalProperties}
          onClick={handlePropertiesClick}
          clickable={true}
        />
        <InfoItem
          icon={AlertTriangle}
          label="Sites with Outstanding Issues"
          value={sitesWithIssues}
          onClick={handleIssuesClick}
          // clickable={true}
        />
        <InfoItem
          icon={ChevronsDown}
          label="Average Compliance Score"
          value={`${averageCompliance}%`}
          onClick={handleComplianceClick}
          clickable={true}
        />
        <InfoItem
          icon={ChevronsDown}
          label="Lowest Compliance Score"
          value={
            lowestComplianceProperty
              ? `${lowestComplianceProperty.name} ${lowestCompliance}%`
              : "N/A"
          }
          onClick={handleLowestComplianceClick}
          clickable={!!lowestComplianceProperty}
        />
        <InfoItem
          icon={ClipboardList}
          label="Total Open Tasks"
          value={totalOpenTasks}
          onClick={handleTasksClick}
          clickable={true}
        />
        {/* <InfoItem
          icon={MapPin}
          label="Primary Fire Station"
          value={fireStation}
        /> */}
      </div>
    </div>
  );
};

export default ImportantInformation;
