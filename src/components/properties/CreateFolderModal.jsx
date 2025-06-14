import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, Check } from "lucide-react";
import FolderImg from "../../assets/Folder.png";

const CreateFolderModal = ({ isOpen, onClose, onSubmit }) => {
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(folderName.trim());
      setFolderName("");
      onClose();
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFolderName("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-grey-outline px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary-orange/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <FolderPlus className="w-5 h-5 text-primary-orange" />
                </div>
                <h2 className="text-xl font-semibold text-primary-black">
                  Create New Folder
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-grey-fill rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-primary-grey" />
              </button>
            </div>

            <div className="px-6 py-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {/* Folder preview */}
                  <div className="flex justify-center">
                    <motion.div
                      animate={{
                        rotateY: folderName ? [0, 10, 0] : 0,
                        scale: folderName ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <img src={FolderImg} alt="Folder" className="w-24 h-24" />
                      {folderName && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute bottom-0 left-0 right-0 bg-primary-orange/90 text-white text-center py-1 text-xs font-medium rounded-b-lg truncate px-2"
                        >
                          {folderName}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-primary-black">
                      Folder Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Enter folder name"
                        className="w-full p-3 pl-10 border border-grey-outline rounded-xl focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange/20 transition-all"
                        required
                        disabled={isSubmitting}
                        autoFocus
                      />
                      <FolderPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-grey" />
                      {folderName && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Check className="w-5 h-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-xs text-primary-grey">
                      Create a new folder to organize your documents
                    </p>
                  </div>
                </div>

                {/* Footer with action buttons */}
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-primary-grey hover:text-primary-black hover:bg-grey-fill rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || !folderName.trim()}
                    className="px-5 py-2.5 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-4 h-4" />
                        <span>Create Folder</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateFolderModal;
