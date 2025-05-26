import { useState, useEffect, useRef } from "react";
import { updateProperty } from "../../services/propertiesServices";
import { X, Upload, Image, Trash2 } from "lucide-react";

const EditPropertyForm = ({ property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: {},
    manager: "",
    assistant_manager: "",
    square_ft: "",
    property_type: "",
    construction_year: "",
    tenure: "",
    insurance_provider: "",
    contact_phone: "",
    email: "",
    floors: "",
    occupants: "",
    local_fire_brigade: "",
    fire_strategy: "",
    evacuation_policy: "",
    emergency_contact: "",
    contactor_hours: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (property) {
      // Convert address from JSONB to form fields
      let addressFields = {};
      if (property.address) {
        if (typeof property.address === "string") {
          try {
            addressFields = JSON.parse(property.address);
          } catch (e) {
            addressFields = { street: property.address };
          }
        } else {
          addressFields = property.address;
        }
      }

      setFormData({
        name: property.name || "",
        address: addressFields,
        manager: property.manager || "",
        assistant_manager: property.assistant_manager || "",
        square_ft: property.square_ft || "",
        property_type: property.property_type || "",
        construction_year: property.construction_year || "",
        tenure: property.tenure || "",
        insurance_provider: property.insurance_provider || "",
        contact_phone: property.contact_phone || "",
        email: property.email || "",
        floors: property.floors || "",
        occupants: property.occupants || "",
        local_fire_brigade: property.local_fire_brigade || "",
        fire_strategy: property.fire_strategy || "",
        evacuation_policy: property.evacuation_policy || "",
        emergency_contact: property.emergency_contact || "",
        contactor_hours: property.contactor_hours || "",
        image: property.image || "",
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateProperty(property.id, formData);
      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error("Error updating property:", err);
      setError("Failed to update property. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 z-10 bg-white p-6 border-b border-grey-outline flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-semibold text-primary-black">
            Edit Property
          </h2>
          <button
            onClick={onClose}
            className="text-primary-grey hover:text-primary-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-6">
          {/* Added pb-24 for padding at bottom to prevent content from overlapping with buttons */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8 pb-24">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary-black">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Property Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="property_type"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Property Type*
                </label>
                <select
                  id="property_type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                >
                  <option value="">Select property type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mixed-Use">Mixed-Use</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="address.street"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address?.street || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="address.city"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address?.city || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="address.postcode"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="address.postcode"
                  name="address.postcode"
                  value={formData.address?.postcode || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="address.country"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address?.country || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="square_ft"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Square Feet
                </label>
                <input
                  type="number"
                  id="square_ft"
                  name="square_ft"
                  value={formData.square_ft}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="construction_year"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Construction Year
                </label>
                <input
                  type="number"
                  id="construction_year"
                  name="construction_year"
                  value={formData.construction_year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="tenure"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Tenure
                </label>
                <select
                  id="tenure"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                >
                  <option value="">Select tenure</option>
                  <option value="Leasehold">Leasehold</option>
                  <option value="Freehold">Freehold</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="insurance_provider"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Insurance Provider
                </label>
                <input
                  type="text"
                  id="insurance_provider"
                  name="insurance_provider"
                  value={formData.insurance_provider}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary-black">
              Management & Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="manager"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Manager
                </label>
                <input
                  type="text"
                  id="manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="assistant_manager"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Assistant Manager
                </label>
                <input
                  type="text"
                  id="assistant_manager"
                  name="assistant_manager"
                  value={formData.assistant_manager}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="contact_phone"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="emergency_contact"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Emergency Contact
                </label>
                <input
                  type="text"
                  id="emergency_contact"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="contactor_hours"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Contractor Hours
                </label>
                <input
                  type="text"
                  id="contactor_hours"
                  name="contactor_hours"
                  value={formData.contactor_hours}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary-black">
              Building Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="floors"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Number of Floors
                </label>
                <input
                  type="number"
                  id="floors"
                  name="floors"
                  value={formData.floors}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="occupants"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Number of Occupants
                </label>
                <input
                  type="number"
                  id="occupants"
                  name="occupants"
                  value={formData.occupants}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="local_fire_brigade"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Local Fire Brigade
                </label>
                <input
                  type="text"
                  id="local_fire_brigade"
                  name="local_fire_brigade"
                  value={formData.local_fire_brigade}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="fire_strategy"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Fire Strategy
                </label>
                <input
                  type="text"
                  id="fire_strategy"
                  name="fire_strategy"
                  value={formData.fire_strategy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="evacuation_policy"
                  className="block text-sm font-medium text-primary-grey mb-1"
                >
                  Evacuation Policy
                </label>
                <input
                  type="text"
                  id="evacuation_policy"
                  name="evacuation_policy"
                  value={formData.evacuation_policy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:ring-primary-orange focus:border-primary-orange"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary-black">
              Property Image
            </h3>
            <div>
              <input
                type="file"
                id="image"
                name="image"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {/* Image preview section */}
              {formData.image ? (
                <div className="relative rounded-lg overflow-hidden border border-grey-outline bg-grey-fill/30 h-48 group">
                  {typeof formData.image === "string" ? (
                    <img
                      src={formData.image}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm text-primary-grey">Preview not available for new file uploads</p>
                    </div>
                  )}
                  
                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Upload className="w-5 h-5 text-primary-black" />
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-grey-outline rounded-lg p-8 flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-grey-fill/30 transition-colors"
                >
                  <Image className="w-10 h-10 text-primary-grey mb-3" />
                  <p className="text-primary-grey font-medium mb-1">Drag and drop or click to upload</p>
                  <p className="text-xs text-primary-grey">Recommended size: 1200 x 800 pixels</p>
                </div>
              )}
            </div>
          </div>

          </form>
        </div>
        
        <div className="sticky bottom-0 bg-white flex justify-end gap-4 p-6 border-t border-grey-outline shadow-md z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-grey-outline rounded-lg text-primary-black hover:bg-grey-fill transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }}
            disabled={loading}
            className="px-6 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyForm;
