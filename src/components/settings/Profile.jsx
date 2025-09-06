import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { User, Camera, Edit3, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile, uploadAvatar } from "../../services/userServices";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    profileName: currentUser?.full_name || "Kevin John",
    email: currentUser?.email || "kevinjohn@gmail.com",
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!currentUser?.id) {
        toast.error("User not found");
        return;
      }

      const updatedProfile = await updateUserProfile(currentUser.id, formData);
      setCurrentUser(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!currentUser?.id) {
      toast.error("User not found");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const updatedUser = await uploadAvatar(currentUser.id, file);
      setCurrentUser(updatedUser);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        profileName: currentUser.full_name || "Kevin John",
        email: currentUser.email || "kevinjohn@gmail.com",
      });
    }
  }, [currentUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* User Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary-black">
          User Details
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-grey-fill border-2 border-grey-outline">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-orange">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <button
              onClick={triggerFileInput}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-black rounded-full flex items-center justify-center hover:bg-secondary-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-3 h-3 text-white" />
              )}
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={triggerFileInput}
              disabled={isUploading}
              className="px-4 py-2 bg-grey-fill text-primary-black rounded-lg hover:bg-grey-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {/* <Upload className="w-4 h-4" /> */}
              <span>{isUploading ? "Uploading..." : "Change Picture"}</span>
            </button>
            <p className="text-xs text-primary-grey">
              JPG, PNG, GIF, WebP up to 5MB
            </p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Account Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary-black">
          Account Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-grey">
              Profile Name
            </label>
            <input
              type="text"
              value={formData.profileName}
              onChange={(e) => handleInputChange("profileName", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-grey-outline rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-orange disabled:bg-grey-fill"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-grey">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-grey-outline rounded-lg bg-grey-fill text-primary-grey cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        {isEditing ? (
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-black text-white rounded-lg hover:bg-secondary-black transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-grey-fill text-primary-black rounded-lg hover:bg-grey-outline transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-primary-black text-white rounded-lg hover:bg-secondary-black transition-colors flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Details</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
