"use client";

import { useState, useEffect } from "react";
import { Upload, Trash } from "lucide-react";

const ConsultancyGallery = ({ formData, setFormData, onUpdate }) => {
  const [previewImages, setPreviewImages] = useState([]);

  // ✅ Load existing images on mount
  useEffect(() => {
    if (formData.gallery_images && Array.isArray(formData.gallery_images)) {
      const loadedImages = formData.gallery_images.map((img) => ({
        id: img.id || Date.now(), // Use existing ID or generate a temporary one
        image: typeof img === "string" ? img : img.image, // Handle both string URLs and image objects
        file: img.file || null, // Store the file object (if it's a new image)
        isNew: !img.id, // Mark as new if it doesn't have an ID from the database
      }));
      setPreviewImages(loadedImages);
    }
  }, [formData.gallery_images]);

  // ✅ Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach((img) => {
        if (img.file) {
          URL.revokeObjectURL(img.image);
        }
      });
    };
  }, [previewImages]);

  // ✅ Handle file selection & preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(), // Generate a temporary ID for new images
      image: URL.createObjectURL(file), // Create a blob URL for preview
      file, // Store the file object
      isNew: true, // Mark as a new upload
    }));

    // ✅ Update local state
    const updatedImages = [...previewImages, ...newImages];
    setPreviewImages(updatedImages);

    // ✅ Append new images to formData
    const updatedFormData = {
      ...formData,
      gallery_images: [...(formData.gallery_images || []), ...newImages], // Add new images to formData
    };
    setFormData(updatedFormData);
    onUpdate(updatedFormData); // ✅ Call onUpdate to notify the parent component
  };

  // ✅ Handle image deletion
  const handleDeleteImage = (index) => {
    const imageToDelete = previewImages[index];
    let updatedImages = previewImages.filter((_, i) => i !== index);

    // ✅ Track deleted images only if they exist in the backend
    if (!imageToDelete.isNew) {
      const updatedDeletedImages = [
        ...(formData.deleted_gallery_images || []),
        imageToDelete.id,
      ];
      setFormData((prev) => ({
        ...prev,
        deleted_gallery_images: updatedDeletedImages,
      }));
      onUpdate({ deleted_gallery_images: updatedDeletedImages });
    }

    // ✅ Update local state
    setPreviewImages(updatedImages);
    setFormData((prev) => ({
      ...prev,
      gallery_images: updatedImages, // Remove from formData
    }));
    onUpdate({ gallery_images: updatedImages });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gallery</h2>

      {/* Upload Button */}
      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center shadow-lg transition duration-200 hover:shadow-xl w-full">
        <Upload className="h-5 w-5 mr-2" />
        Upload Images
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Gallery Preview */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {previewImages.map((image, index) => (
            <div key={image.id} className="relative">
              <img
                src={image.image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-28 md:h-40 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-80"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultancyGallery;
