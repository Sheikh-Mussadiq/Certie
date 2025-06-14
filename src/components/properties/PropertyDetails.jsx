import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  Home,
  User,
  Users,
  Square,
  Building,
  Calendar,
  Key,
  Shield,
  Phone,
  Mail,
  Layers,
  UserCheck,
  FireExtinguisher,
  Flag,
  AlertTriangle,
  Clock,
} from "lucide-react";
import AssessmentsTab from "./AssessmentsTab";
import LogBooksTab from "./LogBooksTab";
import DocumentsTab from "./DocumentsTab";
import EditPropertyForm from "./EditPropertyForm";
import { useAuth } from "../../context/AuthContext";


const PropertyDetails = ({ property, setProperty }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentUser } = useAuth();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "assessments", label: "Assessments" },
    { id: "logbooks", label: "Logbooks" },
    { id: "documents", label: "Documents" },
  ];

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
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary-black">
            Property Details
          </h1>
        </div>

        {activeTab === "overview" && (currentUser.id === property.owner_id || property.managers?.some(manager => manager.user_id === currentUser.id)) && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-grey-outline text-primary-black hover:bg-grey-fill rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Property
          </button>
        )}
      </div>

      <div className="flex space-x-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-white text-primary-black border border-grey-outline shadow-sm"
                : "bg-grey-fill text-primary-grey hover:text-primary-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-grey-outline overflow-hidden">
        <div className="p-6">
          {activeTab === "overview" && (
            <>
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex flex-col gap-2">
                    Property Name: {property?.name}
                    <p className="text-sm text-primary-grey">
                      {property?.address?.street}, {property?.address?.city},{" "}
                      {property?.address?.postcode}
                    </p>
                  </h2>
                  <div className="max-w-3xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden shadow-sm">
                    {property?.image ? (
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-grey-fill flex items-center justify-center">
                        <span className="text-primary-grey">
                          No image available
                        </span>
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
                          <span className="text-sm text-primary-grey">
                            Property ID
                          </span>
                          <p className="text-sm font-medium">
                            {property?.id}
                          </p>
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
                          <span className="text-sm text-primary-grey">
                            Square Ft
                          </span>
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
                          <span className="text-sm text-primary-grey">
                            Floors
                          </span>
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
                          <span className="text-sm text-primary-grey">
                            Tenure
                          </span>
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
                          <span className="text-sm text-primary-grey">
                            Contact
                          </span>
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
                          <span className="text-sm text-primary-grey">
                            Email
                          </span>
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
                          <span className="text-sm text-primary-grey">
                            Occupants
                          </span>
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

              <div className="py-8 mt-8 border-t border-grey-outline">
                <h3 className="text-lg font-semibold mb-4">
                  Protection Assets
                </h3>
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
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          {asset.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeTab === "assessments" && (
            <AssessmentsTab owner_id={property.owner_id} property={property} />
          )}
          {activeTab === "logbooks" && <LogBooksTab />}
          {activeTab === "documents" && <DocumentsTab owner_id={property.owner_id} />}
        </div>
      </div>

      {isEditModalOpen && (
        <EditPropertyForm
          property={property}
          setProperty={setProperty}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            // Force a refresh of the component by changing the key
            // setRefreshKey(prev => prev + 1);
            // Reload the page to get updated property data
            // window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
