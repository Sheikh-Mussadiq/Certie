import {
  Home,
  Users,
  Square,
  Building,
  Calendar,
  Key,
  Shield,
  Phone,
  Mail,
  Layers,
  FireExtinguisher,
  Flag,
  AlertTriangle,
  Clock,
  UserCheck,
  UserCog,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import StaticMap from "../ui/StaticMap";

const PropertyOverview = () => {
  const { property } = useOutletContext();
  const protectionAssets = [
    {
      asset: "Fire Alarm System",
      lastChecked: "12 Mar - 2025",
      status: "Completed",
    },
    {
      asset: "Fire Extinguisher",
      lastChecked: "12 Mar - 2025",
      status: "Completed",
    },
    {
      asset: "8 Pegier Square, London E3 4PL",
      lastChecked: "12 Mar - 2025",
      status: "Completed",
    },
    {
      asset: "8 Pegier Square, London E3 4PL",
      lastChecked: "12 Mar - 2025",
      status: "Completed",
    },
  ];

  return (
    <>
      <div className="space-y-4 sm:space-y-8 bg-white rounded-xl border border-grey-outline overflow-hidden p-3 sm:p-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex flex-col gap-2">
            Property Name: {property?.name || "No Property Name"}
            <p className="text-xs sm:text-sm text-primary-grey">
              {property?.address?.street}, {property?.address?.city},{" "}
              {property?.address?.postcode}
            </p>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Image Column */}
            <div className="h-[250px] sm:h-[350px] md:h-[400px] rounded-xl overflow-hidden shadow-sm">
              {property?.image ? (
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              ) : (
                <div className="w-full h-full bg-grey-fill flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-grey-200 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-grey-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-grey-600 mb-1">
                    No Property Image
                  </h3>
                  <p className="text-xs text-grey-500 max-w-[200px]">
                    Upload a property photo to showcase the building exterior
                  </p>
                </div>
              )}
            </div>

            {/* Map Column */}
            <div className="h-[250px] sm:h-[350px] md:h-[400px] rounded-xl overflow-hidden shadow-sm">
              {property?.latitude && property?.longitude ? (
                <StaticMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  address={`${property?.address?.street}, ${property?.address?.city}, ${property?.address?.postcode}`}
                />
              ) : (
                <div className="w-full h-full bg-grey-fill flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-grey-200 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-grey-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-grey-600 mb-1">
                    Location Not Set
                  </h3>
                  <p className="text-xs text-grey-500 max-w-[200px]">
                    Add property coordinates to display an interactive map view
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-0">
          <div className="border border-grey-outline rounded-2xl md:rounded-r-none">
            <h3 className="text-xs sm:text-sm font-medium text-primary-grey p-3 sm:p-4 border-b border-grey-outline">
              Property Information
            </h3>
            <div className="divide-y divide-grey-outline">
              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">Property ID</span>
                  <p className="text-xs sm:text-sm font-medium truncate">{property?.id}</p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Compliance Score
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.compliance_score || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Square className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">Square Ft</span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.square_ft || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">Floors</span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.floors || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Property Type
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.property_type || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Construction Year
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.construction_year || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">Tenure</span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.tenure || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Insurance Provider
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.insurance_provider || "Not Specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-grey-outline rounded-2xl md:rounded-l-none md:border-l-0">
            <h3 className="text-xs sm:text-sm font-medium text-primary-grey p-3 sm:p-4 border-b border-grey-outline">
              Contact Information
            </h3>
            <div className="divide-y divide-grey-outline">
              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">Contact</span>
                  <p className="text-xs sm:text-sm font-medium break-all">
                    {property?.contact_phone || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">Email</span>
                  <p className="text-xs sm:text-sm font-medium break-all">
                    {property?.email || "flat2@acre.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">Occupants</span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.occupants || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <FireExtinguisher className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Local Fire Brigade
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.local_fire_brigade || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Fire Strategy
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.fire_strategy || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Evacuation Policy
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.evacuation_policy || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Emergency Contact
                  </span>
                  <p className="text-xs sm:text-sm font-medium break-all">
                    {property?.emergency_contact || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-primary-grey">
                    Contractor Hours
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    {property?.contactor_hours || "Not Specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Team Section */}
      <div className="bg-white rounded-xl border border-grey-outline overflow-hidden p-3 sm:p-4 mt-3 sm:mt-4">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Property Team</h3>
        <p className="text-xs sm:text-sm text-primary-grey">
          Property Managers are responsible for the overall management of the
          property. Site Users are responsible for the day to day operations of
          the property.
        </p>
        <p className="text-xs sm:text-sm text-primary-grey mb-3 sm:mb-4">
          <strong>Manage your team in the edit property button above.</strong>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-0">
          {/* Property Managers */}
          <div className="border border-grey-outline rounded-2xl md:rounded-r-none">
            <h4 className="text-xs sm:text-sm font-medium text-primary-grey p-3 sm:p-4 border-b border-grey-outline flex items-center">
              <UserCog className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Property Managers ({property?.managers?.length || 0})
            </h4>
            <div className="divide-y divide-grey-outline">
              {property?.managers && property.managers.length > 0 ? (
                property.managers.map((manager, index) => (
                  <div key={index} className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                      <UserCog className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">
                        {manager.name || manager.email || "Unknown Manager"}
                      </p>
                      {manager.email && (
                        <p className="text-xs text-primary-grey break-all">
                          {manager.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                    <UserCog className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-primary-grey">
                      No managers assigned
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Site Users */}
          <div className="border border-grey-outline rounded-2xl md:rounded-l-none md:border-l-0">
            <h4 className="text-xs sm:text-sm font-medium text-primary-grey p-3 sm:p-4 border-b border-grey-outline flex items-center">
              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Site Users ({property?.site_users?.length || 0})
            </h4>
            <div className="divide-y divide-grey-outline">
              {property?.site_users && property.site_users.length > 0 ? (
                property.site_users.map((siteUser, index) => (
                  <div key={index} className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">
                        {siteUser.name || siteUser.email || "Unknown User"}
                      </p>
                      {siteUser.email && (
                        <p className="text-xs text-primary-grey break-all">
                          {siteUser.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-primary-grey mr-2 sm:mr-3 flex-shrink-0">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-primary-grey">
                      No site users assigned
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="py-8 mt-4 bg-white rounded-xl border border-grey-outline overflow-hidden p-4">
        <h3 className="text-lg font-semibold mb-4">Protection Assets</h3>
        <div className="bg-white rounded-2xl border border-grey-outline overflow-hidden">
          <div className="grid grid-cols-3 border-b border-grey-outline">
            <div className="text-sm font-medium text-primary-grey p-4 border-r border-grey-outline">
              Asset
            </div>
            <div className="text-sm font-medium text-primary-grey p-4 border-r border-grey-outline">
              Last Checked
            </div>
            <div className="text-sm font-medium text-primary-grey p-4">
              Status
            </div>
          </div>
          {protectionAssets.map((asset, index) => (
            <div
              key={index}
              className="grid grid-cols-3 border-b border-grey-outline last:border-b-0"
            >
              <div className="p-4 text-sm font-medium border-r border-grey-outline">
                {asset.asset}
              </div>
              <div className="p-4 text-sm text-primary-grey border-r border-grey-outline">
                {asset.lastChecked}
              </div>
              <div className="p-4 text-sm">
                <span className="px-2 py-1 text-xs font-medium text-primary-green bg-green-100 rounded-full">
                  {asset.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};
export default PropertyOverview;
