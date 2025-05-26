import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropertyDetailsComponent from "../components/properties/PropertyDetails";
import { getPropertyById } from "../services/propertiesServices";
import LoadingSpinner from "../components/LoadingSpinner";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details");
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button 
            onClick={() => navigate('/properties')} 
            className="ml-4 underline"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          Property not found
          <button 
            onClick={() => navigate('/properties')} 
            className="ml-4 underline"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return <PropertyDetailsComponent property={property} setProperty={setProperty} />;
};

export default PropertyDetails;
