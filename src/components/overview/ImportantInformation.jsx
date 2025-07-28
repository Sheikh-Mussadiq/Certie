import {
  ListChecks,
  AlertTriangle,
  ChevronsDown,
  ClipboardList,
  MapPin,
} from "lucide-react";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start text-sm">
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

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-grey-fill border border-grey-outline mr-2">
          <ListChecks size={20} className="text-gray-600" />
        </div>
        <h3 className="font-semibold text-gray-700">Important Information</h3>
      </div>
      <div className="space-y-3 text-sm">
        <InfoItem
          icon={ListChecks}
          label="Total Properties"
          value={totalProperties}
        />
        <InfoItem
          icon={AlertTriangle}
          label="Sites with Outstanding Issues"
          value={sitesWithIssues}
        />
        <InfoItem
          icon={ChevronsDown}
          label="Average Compliance Score"
          value={`${averageCompliance}%`}
        />
        <InfoItem
          icon={ChevronsDown}
          label="Lowest Compliance Score"
          value={
            lowestComplianceProperty
              ? `${lowestComplianceProperty.name} ${lowestCompliance}%`
              : "N/A"
          }
        />
        <InfoItem
          icon={ClipboardList}
          label="Total Open Tasks"
          value={totalOpenTasks}
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
