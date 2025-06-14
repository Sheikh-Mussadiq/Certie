import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { createProperty } from "../services/propertiesServices";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AddProperty = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },
    property_type: "Residential",
    image: null,
    owner_id: currentUser.id,
    compliance_score: 0,
    manager: "",
    assistant_manager: "",
    square_ft: 0,
    construction_year: 100,
    tenure: "Leasehold",
    insurance_provider: "",
    contact_phone: "",
    email: "",
    floors: 0,
    occupants: 0,
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

  const property_types = ["Residential", "Commercial", "Mixed-Use"];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const property = await createProperty(formData, currentUser.id);
      toast.success("Property created successfully!");
      navigate(`/properties/${property.id}`);
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error(error.message || "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-2 px-6 py-2 border-b border-grey-outline">
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
            disabled={isSubmitting}
            className="px-4 py-2 text-primary-black bg-white border border-grey-outline shadow-sm rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-fill-black text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Property"
            )}
          </button>
        </div>
      </div>

      <div className="px-6 py-2">
        <div className="mb-8 border border-grey-outline rounded-xl p-4">
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
          <div className="border border-grey-outline rounded-xl p-4">
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

          <div className="space-y-4 md:col-span-2 border border-grey-outline rounded-xl p-4">
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

          <div className="md:col-span-2 border border-grey-outline rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Property Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Property Type
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      property_type: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                >
                  <option value="">Select property type</option>
                  {property_types.map((type) => (
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
                    setFormData((prev) => ({
                      ...prev,
                      square_ft: e.target.value,
                    }))
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
                    setFormData((prev) => ({
                      ...prev,
                      occupants: e.target.value,
                    }))
                  }
                  placeholder="Enter number of occupants"
                  className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 border border-grey-outline rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Management Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Manager
                </label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      manager: e.target.value,
                    }))
                  }
                  placeholder="Enter manager name"
                  className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 border border-grey-outline rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">
              Safety & Emergency Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default AddProperty;
