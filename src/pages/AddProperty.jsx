import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },
    propertyType: "",
    image: null,
    compliance_score: 0,
    manager: "",
    assistant_manager: "",
    square_ft: "",
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
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        setFormData((prev) => ({
          ...prev,
          image: acceptedFiles[0],
        }));
      }
    },
  });

  const propertyTypes = ["Residential", "Commercial", "Mixed-Use"];

  const tenureTypes = ["Leasehold", "Freehold"];

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement property creation
    console.log("Property data:", formData);
    navigate(`/properties/${1}`); // Navigate to property details page after creation
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-primary-black">
            Add a Property
          </h1>
          <p className="text-sm text-primary-grey">
            Add task instructions and other association if any
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/properties")}
            className="px-4 py-2 text-primary-black hover:bg-grey-fill rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors"
          >
            Save Property
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-2">Upload Property Image</h3>
          <p className="text-xs text-primary-grey mb-4">
            formats allowed are *.jpg, *.jpg, up to 10 MB
            <br />
            with a minimum size of 400px by 400px
          </p>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-primary-orange bg-red-50"
                  : "border-grey-outline hover:border-primary-orange"
              }`}
          >
            <input {...getInputProps()} />
            {formData.image ? (
              <div className="flex items-center justify-center">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Property preview"
                  className="max-h-48 rounded"
                />
              </div>
            ) : (
              <>
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag & drop an image here, or click to select
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Property Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter property name"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Street</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                  placeholder="Enter street address"
                  className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Enter city"
                  className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="Enter state"
                  className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={formData.address.postcode}
                  onChange={(e) =>
                    handleAddressChange("postcode", e.target.value)
                  }
                  placeholder="Enter postcode"
                  className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) =>
                    handleAddressChange("country", e.target.value)
                  }
                  placeholder="Enter country"
                  className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Property Details</h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Property Type
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyType: e.target.value,
                }))
              }
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            >
              <option value="">Select property type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Square Feet
            </label>
            <input
              type="number"
              value={formData.square_ft}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, square_ft: e.target.value }))
              }
              placeholder="Enter square feet"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Construction Year
            </label>
            <input
              type="number"
              value={formData.construction_year}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  construction_year: e.target.value,
                }))
              }
              placeholder="Enter construction year"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tenure</label>
            <select
              value={formData.tenure}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tenure: e.target.value }))
              }
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            >
              <option value="">Select tenure type</option>
              {tenureTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Insurance Provider
            </label>
            <input
              type="text"
              value={formData.insurance_provider}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  insurance_provider: e.target.value,
                }))
              }
              placeholder="Enter insurance provider"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_phone: e.target.value,
                }))
              }
              placeholder="Enter contact phone"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter email"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Floors
            </label>
            <input
              type="number"
              value={formData.floors}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, floors: e.target.value }))
              }
              placeholder="Enter number of floors"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Occupants
            </label>
            <input
              type="number"
              value={formData.occupants}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, occupants: e.target.value }))
              }
              placeholder="Enter number of occupants"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Management Details</h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Manager</label>
            <input
              type="text"
              value={formData.manager}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, manager: e.target.value }))
              }
              placeholder="Enter manager name"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Assistant Manager
            </label>
            <input
              type="text"
              value={formData.assistant_manager}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  assistant_manager: e.target.value,
                }))
              }
              placeholder="Enter assistant manager name"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">
              Safety & Emergency Details
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Local Fire Brigade
            </label>
            <input
              type="text"
              value={formData.local_fire_brigade}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  local_fire_brigade: e.target.value,
                }))
              }
              placeholder="Enter local fire brigade details"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Emergency Contact
            </label>
            <input
              type="text"
              value={formData.emergency_contact}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emergency_contact: e.target.value,
                }))
              }
              placeholder="Enter emergency contact details"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Fire Strategy
            </label>
            <textarea
              value={formData.fire_strategy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fire_strategy: e.target.value,
                }))
              }
              placeholder="Enter fire strategy details"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Evacuation Policy
            </label>
            <textarea
              value={formData.evacuation_policy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  evacuation_policy: e.target.value,
                }))
              }
              placeholder="Enter evacuation policy details"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contractor Hours
            </label>
            <input
              type="text"
              value={formData.contactor_hours}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactor_hours: e.target.value,
                }))
              }
              placeholder="Enter contractor hours"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
