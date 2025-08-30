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
      <div className="space-y-8 bg-white rounded-xl border border-grey-outline overflow-hidden p-4">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex flex-col gap-2">
            Property Name: {property?.name}
            <p className="text-sm text-primary-grey">
              {property?.address?.street}, {property?.address?.city},{" "}
              {property?.address?.postcode}
            </p>
          </h2>
          <div className="w-full h-[400px] mx-auto rounded-xl overflow-hidden shadow-sm">
            {property?.image ? (
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            ) : (
              <div className="w-full h-full bg-grey-fill flex items-center justify-center">
                <span className="text-primary-grey">No image available</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="border border-grey-outline rounded-2xl md:rounded-r-none">
            <h3 className="text-sm font-medium text-primary-grey p-4 border-b border-grey-outline">
              Property Information
            </h3>
            <div className="divide-y divide-grey-outline">
              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Home className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">Property ID</span>
                  <p className="text-sm font-medium">{property?.id}</p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Compliance Score
                  </span>
                  <p className="text-sm font-medium">
                    {property?.compliance_score || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Square className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">Square Ft</span>
                  <p className="text-sm font-medium">
                    {property?.square_ft || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">Floors</span>
                  <p className="text-sm font-medium">
                    {property?.floors || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Building className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Property Type
                  </span>
                  <p className="text-sm font-medium">
                    {property?.property_type || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Construction Year
                  </span>
                  <p className="text-sm font-medium">
                    {property?.construction_year || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Key className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">Tenure</span>
                  <p className="text-sm font-medium">
                    {property?.tenure || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Insurance Provider
                  </span>
                  <p className="text-sm font-medium">
                    {property?.insurance_provider || "Not Specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-grey-outline rounded-2xl md:rounded-l-none md:border-l-0">
            <h3 className="text-sm font-medium text-primary-grey p-4 border-b border-grey-outline">
              Contact Information
            </h3>
            <div className="divide-y divide-grey-outline">
              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">Contact</span>
                  <p className="text-sm font-medium">
                    {property?.contact_phone || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">Email</span>
                  <p className="text-sm font-medium">
                    {property?.email || "flat2@acre.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">Occupants</span>
                  <p className="text-sm font-medium">
                    {property?.occupants || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <FireExtinguisher className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Local Fire Brigade
                  </span>
                  <p className="text-sm font-medium">
                    {property?.local_fire_brigade || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Flag className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Fire Strategy
                  </span>
                  <p className="text-sm font-medium">
                    {property?.fire_strategy || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Evacuation Policy
                  </span>
                  <p className="text-sm font-medium">
                    {property?.evacuation_policy || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Emergency Contact
                  </span>
                  <p className="text-sm font-medium">
                    {property?.emergency_contact || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-primary-grey">
                    Contractor Hours
                  </span>
                  <p className="text-sm font-medium">
                    {property?.contactor_hours || "Not Specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Team Section */}
      <div className="bg-white rounded-xl border border-grey-outline overflow-hidden p-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Property Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Property Managers */}
          <div className="border border-grey-outline rounded-2xl md:rounded-r-none">
            <h4 className="text-sm font-medium text-primary-grey p-4 border-b border-grey-outline flex items-center">
              <UserCog className="w-4 h-4 mr-2" />
              Property Managers ({property?.managers?.length || 0})
            </h4>
            <div className="divide-y divide-grey-outline">
              {property?.managers && property.managers.length > 0 ? (
                property.managers.map((manager, index) => (
                  <div key={index} className="flex items-center px-4 py-3">
                    <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                      <UserCog className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {manager.name || manager.email || "Unknown Manager"}
                      </p>
                      {manager.email && (
                        <p className="text-xs text-primary-grey">
                          {manager.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center px-4 py-3">
                  <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                    <UserCog className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-primary-grey">
                      No managers assigned
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Site Users */}
          <div className="border border-grey-outline rounded-2xl md:rounded-l-none md:border-l-0">
            <h4 className="text-sm font-medium text-primary-grey p-4 border-b border-grey-outline flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              Site Users ({property?.site_users?.length || 0})
            </h4>
            <div className="divide-y divide-grey-outline">
              {property?.site_users && property.site_users.length > 0 ? (
                property.site_users.map((siteUser, index) => (
                  <div key={index} className="flex items-center px-4 py-3">
                    <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {siteUser.name || siteUser.email || "Unknown User"}
                      </p>
                      {siteUser.email && (
                        <p className="text-xs text-primary-grey">
                          {siteUser.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center px-4 py-3">
                  <div className="w-8 h-8 flex items-center justify-center text-primary-grey mr-3">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-primary-grey">
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
