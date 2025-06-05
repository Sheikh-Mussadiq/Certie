import { motion } from "framer-motion";
import { Download, Upload, Plus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TableHeader from "../components/properties/TableHeader";
import TableFooter from "../components/properties/TableFooter";
import PropertyTable from "../components/properties/PropertyTable";
import PropertyListView from "../components/properties/PropertyListView";
import { getProperties } from "../services/propertiesServices";
import LoadingSpinner from "../components/LoadingSpinner";
import PropertyShimmer from "../components/properties/Shimmers/PropertyShimmer";
import PropertyListShimmer from "../components/properties/Shimmers/PropertyListShimmer";
import TableHeaderShimmer from "../components/properties/Shimmers/TableHeaderShimmer";

const applyFilters = (properties, filters) => {
  if (!filters) return properties;

  return properties.filter((property) => {
    let matches = true;

    if (filters.property_type) {
      matches = matches && property.property_type === filters.property_type;
    }

    if (filters.complianceScore) {
      const score = property.complianceScore;
      if (filters.complianceScore === "Above 90%") {
        matches = matches && score > 90;
      } else if (filters.complianceScore === "70-90%") {
        matches = matches && score >= 70 && score <= 90;
      } else if (filters.complianceScore === "Below 70%") {
        matches = matches && score < 70;
      }
    }

    if (filters.trainingScore) {
      const score = property.trainingScore;
      if (filters.trainingScore === "Above 90%") {
        matches = matches && score > 90;
      } else if (filters.trainingScore === "70-90%") {
        matches = matches && score >= 70 && score <= 90;
      } else if (filters.trainingScore === "Below 70%") {
        matches = matches && score < 70;
      }
    }

    return matches;
  });
};

const applySorting = (properties, sort) => {
  if (!sort?.field) return properties;

  return [...properties].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (typeof aValue === "string") {
      return sort.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
  });
};

const Properties = () => {
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" or "list"
  const [currentSort, setCurrentSort] = useState(null);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search term
  let filteredProperties = properties.filter(
    (property) =>
      (property.address &&
        JSON.stringify(property.address)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (property.manager &&
        property.manager.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Apply filters
  filteredProperties = applyFilters(filteredProperties, currentFilters);

  // Apply sorting
  filteredProperties = applySorting(filteredProperties, currentSort);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSort = (field) => {
    setCurrentSort((prev) => ({
      field,
      direction:
        prev?.field === field && prev?.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilter = (field, value) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [field]: prev?.[field] === value ? null : value,
    }));
  };

  const handleAddProperty = (propertyData) => {
    console.log("New property:", propertyData);
    // TODO: Implement property creation logic
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-primary-black">
          Properties
        </h1>
        <div className="flex gap-3">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-grey-outline rounded-lg text-primary-black hover:bg-grey-fill transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="px-4 py-2 border border-grey-outline rounded-lg text-primary-black hover:bg-grey-fill transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <button
            onClick={() => navigate("/properties/add")}
            className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-grey-outline overflow-hidden">
          {loading ? (
            <>
              <TableHeaderShimmer />
              {viewMode === "table" ? (
                <PropertyShimmer count={itemsPerPage} />
              ) : (
                <PropertyListShimmer count={itemsPerPage} />
              )}
              <div className="p-4 border-t border-grey-outline relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div className="w-48 h-8 bg-grey-fill rounded"></div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-grey-fill rounded"></div>
                    <div className="w-8 h-8 bg-grey-fill rounded"></div>
                    <div className="w-8 h-8 bg-grey-fill rounded"></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <TableHeader
                onSearch={setSearchTerm}
                onSort={handleSort}
                onFilter={handleFilter}
                currentSort={currentSort}
                currentFilters={currentFilters}
                onViewChange={setViewMode}
                viewMode={viewMode}
              />
              {viewMode === "table" ? (
                <PropertyTable
                  properties={currentProperties}
                  selectedProperties={selectedProperties}
                  onSelectProperty={setSelectedProperties}
                />
              ) : (
                <PropertyListView
                  properties={currentProperties}
                  selectedProperties={selectedProperties}
                  onSelectProperty={setSelectedProperties}
                />
              )}
              <TableFooter
                totalItems={filteredProperties.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;
