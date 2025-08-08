import { Building2 } from "lucide-react";

const formatAddress = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address;
  const parts = [address.street, address.city, address.postcode].filter(
    Boolean
  );
  return parts.join(", ");
};

const StatPill = ({ label, value, colorClass }) => (
  <div className="flex items-center gap-2 bg-grey-fill rounded-lg px-3 py-2 border border-grey-outline">
    <span className={`w-2 h-2 rounded-full ${colorClass}`} />
    <span className="text-sm text-primary-grey">{label}</span>
    <span className="text-sm font-semibold text-primary-black">{value}</span>
  </div>
);

const LogbookPageHeader = ({
  property,
  stats,
  rightSlot = null,
  onOpenProperty,
}) => {
  // Skeleton while loading property
  if (!property) {
    return (
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-grey-fill rounded-lg" />
          <div>
            <div className="h-6 bg-grey-fill rounded w-48 mb-2" />
            <div className="h-4 bg-grey-fill rounded w-64" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-40 bg-grey-fill rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-grey-fill flex items-center justify-center border border-grey-outline">
          <Building2 className="w-6 h-6 text-primary-grey" />
        </div>
        <div>
          <button
            type="button"
            onClick={onOpenProperty}
            className="text-left text-2xl font-semibold text-primary-black hover:text-primary-orange transition-colors"
            title="Open property details"
          >
            {property.name}
          </button>
          <p className="text-sm text-primary-grey">
            {formatAddress(property.address)}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <StatPill
              label="Total"
              value={stats.total}
              colorClass="bg-primary-black"
            />
            <StatPill
              label="Active"
              value={stats.active}
              colorClass="bg-primary-green"
            />
            <StatPill
              label="Inactive"
              value={stats.inactive}
              colorClass="bg-gray-300"
            />
          </div>
        </div>
      </div>

      {rightSlot && <div className="w-full md:w-auto">{rightSlot}</div>}
    </div>
  );
};

export default LogbookPageHeader;
