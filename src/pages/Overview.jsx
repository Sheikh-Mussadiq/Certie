import { useState } from "react";
import { useOverviewData } from "../hooks/useOverviewData";
import PropertyFilter from "../components/overview/PropertyFilter";
import ComplianceScoreShimmer from "../components/overview/shimmers/ComplianceScoreShimmer";
import UpcomingBookingsShimmer from "../components/overview/shimmers/UpcomingBookingsShimmer";
import OutstandingIssuesShimmer from "../components/overview/shimmers/OutstandingIssuesShimmer";
import ImportantInformationShimmer from "../components/overview/shimmers/ImportantInformationShimmer";
import OverdueLogbookTasksShimmer from "../components/overview/shimmers/OverdueLogbookTasksShimmer";
import RecentActivityShimmer from "../components/overview/shimmers/RecentActivityShimmer";
import PropertySummaryShimmer from "../components/overview/shimmers/PropertySummaryShimmer";
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
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const handleSelectProperty = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  const filteredProperties = selectedPropertyId
    ? properties.filter((p) => p.id === selectedPropertyId)
    : properties;

  const filteredBookings = selectedPropertyId
    ? bookings.filter((b) => b.property_id === selectedPropertyId)
    : bookings;

  const filteredLogbooks = selectedPropertyId
    ? logbooks.filter((l) => l.property_id === selectedPropertyId)
    : logbooks;

  const filteredDocuments = selectedPropertyId
    ? documents.filter((d) => d.property_id === selectedPropertyId)
    : documents;

  if (loading) {
    return (
      <div className="p-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ComplianceScoreShimmer />
              <UpcomingBookingsShimmer />
            </div>
            <PropertySummaryShimmer />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OutstandingIssuesShimmer />
              <ImportantInformationShimmer />
            </div>
          </div>
          <div className="space-y-4">
            <OverdueLogbookTasksShimmer />
            <RecentActivityShimmer />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-2">
      <OverviewHeader selectedPropertyId={selectedPropertyId}>
        <PropertyFilter
          properties={properties}
          selectedProperty={selectedPropertyId}
          onSelectProperty={handleSelectProperty}
        />
      </OverviewHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComplianceScore properties={filteredProperties} />
            <UpcomingBookings bookings={filteredBookings} />
          </div>
          <PropertySummary properties={filteredProperties} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OutstandingIssues logbooks={filteredLogbooks} />
            <ImportantInformation
              properties={filteredProperties}
              logbooks={filteredLogbooks}
              bookings={filteredBookings}
            />
          </div>
        </div>
        <div className="space-y-4">
          {/* <ExpiringCertificates documents={documents} /> */}
          <OverdueLogbookTasks logbooks={filteredLogbooks} />
          <RecentActivity
            logbooks={filteredLogbooks}
            bookings={filteredBookings}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
