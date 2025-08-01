import { useOverviewData } from "../hooks/useOverviewData";
import LoadingSpinner from "../components/LoadingSpinner";
import ComplianceScore from "../components/overview/ComplianceScore";
import UpcomingBookings from "../components/overview/UpcomingBookings";
import ExpiringCertificates from "../components/overview/ExpiringCertificates";
import OutstandingIssues from "../components/overview/OutstandingIssues";
import ImportantInformation from "../components/overview/ImportantInformation";
import OverdueLogbookTasks from "../components/overview/OverdueLogbookTasks";
import RecentActivity from "../components/overview/RecentActivity";
import PropertySummary from "../components/overview/PropertySummary";
import OverviewHeader from "../components/overview/OverviewHeader";

const Overview = () => {
  const { properties, bookings, documents, logbooks, loading, error } =
    useOverviewData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-2">
      <OverviewHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComplianceScore properties={properties} />
            <UpcomingBookings bookings={bookings} />
          </div>
          {/* <PropertySummary properties={properties} /> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OutstandingIssues logbooks={logbooks} />
            <ImportantInformation
              properties={properties}
              logbooks={logbooks}
              bookings={bookings}
            />
          </div>
        </div>
        <div className="space-y-4">
          {/* <ExpiringCertificates documents={documents} /> */}
          <OverdueLogbookTasks logbooks={logbooks} />
          <RecentActivity logbooks={logbooks} bookings={bookings} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
