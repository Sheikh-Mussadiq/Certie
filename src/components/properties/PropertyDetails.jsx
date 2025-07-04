import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const { id } = useParams();

  const tabs = [
    { id: "overview", label: "Overview", path: `/properties/${id}` },
    {
      id: "assessments",
      label: "Assessments",
      path: `/properties/${id}/assessments`,
    },
    {
      id: "logbooks",
      label: "Logbooks",
      path: `/properties/${id}/logbooks`,
    },
    {
      id: "documents",
      label: "Documents",
      path: `/properties/${id}/documents`,
    },
  ];

  const isActive = (path) => {
    if (path.endsWith(`/properties/${id}`)) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

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

        {isActive(`/properties/${id}`) &&
          (currentUser.id === property.owner_id ||
            property.managers?.some(
              (manager) => manager.user_id === currentUser.id
            )) && (
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
          <NavLink
            key={tab.id}
            to={tab.path}
            end={tab.path.endsWith(`/properties/${id}`)}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-white text-primary-black border border-grey-outline shadow-sm"
                  : "bg-grey-fill text-primary-grey hover:text-primary-black"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="">
        <Outlet context={{ property, setProperty }} />
      </div>

      {isEditModalOpen && (
        <EditPropertyForm
          property={property}
          setProperty={setProperty}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
