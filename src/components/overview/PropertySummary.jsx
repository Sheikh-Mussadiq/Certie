import { MapPin, Building, Phone, User } from "lucide-react";

const InfoLine = ({ icon: Icon, text }) => (
  <div className="flex items-start text-sm">
    <Icon className="w-4 h-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
    <span className="text-gray-700">{text}</span>
  </div>
);

const PropertySummary = ({ properties }) => {
  const property = properties.length > 0 ? properties[0] : null;

  if (!property) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500">No property data available.</p>
      </div>
    );
  }

  const responsiblePerson =
    property.managers.length > 0
      ? property.managers[0]
      : property.site_users.length > 0
      ? property.site_users[0]
      : null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <img
          src={property.image || "https://via.placeholder.com/400x300"}
          alt={property.name}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
      <div className="md:w-1/2 space-y-3">
        <InfoLine
          icon={MapPin}
          text={`Address: ${property.address.street}, ${property.address.city}, ${property.address.post_code}`}
        />
        <InfoLine
          icon={Building}
          text={`Property Type: ${property.property_type}`}
        />
        <InfoLine
          icon={MapPin}
          text={`Local Fire Station: ${property.local_fire_station || "N/A"}`}
        />
        <InfoLine
          icon={Phone}
          text={`Emergency Contact: ${property.emergency_contact || "N/A"}`}
        />

        {responsiblePerson && (
          <div className="flex items-center pt-3">
            <img
              src={
                responsiblePerson.avatar_url ||
                `https://i.pravatar.cc/40?u=${responsiblePerson.id}`
              }
              alt={responsiblePerson.full_name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="text-sm">
              <p className="font-semibold">{responsiblePerson.full_name}</p>
            </div>
            <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Responsible Person
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertySummary;
