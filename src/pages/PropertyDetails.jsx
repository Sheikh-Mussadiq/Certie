import { useParams } from "react-router-dom";
import PropertyDetailsComponent from "../components/properties/PropertyDetails";

const PropertyDetails = () => {
  const { id } = useParams();

  // TODO: Fetch property details from API using id
  const mockProperty = {
    id: "01",
    name: "Eiffel Tower",
    address: {
      street: "Champ de Mars",
      city: "5 Avenue Anatole France",
      postcode: "75007 Paris",
      country: "France",
    },
    manager: "John Smith",
    assistant_manager: "Sarah Clark",
    square_ft: "850 sqft",
    property_type: "Residential",
    construction_year: "2001",
    tenure: "Leasehold",
    insurance_provider: "Acme Insurance",
    contact_phone: "020 1234 56789",
    email: "flat2@acre.com",
    floors: "2",
    occupants: "4",
    local_fire_brigade: "London Fire Brigade",
    fire_strategy: "Stay in Place",
    evacuation_policy: "Immediate Evacuation",
    emergency_contact: "07890 123456",
    contactor_hours: "08:00 - 17:00, Mon-Fri",
  };

  return <PropertyDetailsComponent property={mockProperty} />;
};

export default PropertyDetails;
