import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import ImageCropper from './ImageCropper';

const AvatarUpload = ({ onUpload, currentAvatar }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 2 * 1024 * 1024,
    multiple: false
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!file || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      
      // Create canvas for cropping
      const image = new Image();
      image.src = preview;
      await new Promise((resolve) => { image.onload = resolve; });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });

      await onUpload(croppedFile);
      
      // Cleanup
      setFile(null);
      setPreview(null);
      URL.revokeObjectURL(preview);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    if (preview) URL.revokeObjectURL(preview);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="dropzone"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 2MB
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="cropper"
            className="space-y-4"
          >
            <ImageCropper
              image={preview}
              onCropComplete={onCropComplete}
            />
            <div className="flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpload}
                className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvatarUpload;