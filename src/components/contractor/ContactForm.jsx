import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postcode: "",
    additionalInfo: "",
    attachments: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    // Check if all required fields are filled
    if (
      newFormData.name &&
      newFormData.email &&
      newFormData.phone &&
      newFormData.address &&
      newFormData.postcode
    ) {
      onSubmit(newFormData);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFormData = {
      ...prev,
      attachments: [...formData.attachments, ...files],
    };
    setFormData(newFormData);
    onSubmit(newFormData);
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    return false;
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8 border border-grey-outline rounded-xl p-4">
        <h3 className="font-semibold text-lg mb-2">Contact Details</h3>
        <p className="text-sm text-primary-grey mb-6">
          Enable plane backwards needle optimize synergy. Shelf-ware or hill
          want on land bandwagon opportunity great team.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Name"
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter Address"
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Post Code
              </label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                placeholder="Enter Post Code"
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Information
              </label>
              <input
                type="text"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Enter Additional Information"
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Attachments
            </label>
            <div className="border border-grey-outline rounded-md p-4">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block px-4 py-2 border border-primary-orange text-primary-orange rounded-md hover:bg-red-50"
              >
                Add Files
              </label>

              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-orange bg-opacity-10 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-orange">
                          {file.name.split(".").pop().toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-primary-grey">
                          File size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactForm;
