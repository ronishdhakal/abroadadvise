"use client";

import { useState, useEffect } from "react";
import { Upload, Trash } from "lucide-react";

const ConsultancyGallery = ({ formData, setFormData, onUpdate }) => {
  if (!formData) return null; // ✅ Prevents crash if formData is undefined

  const [previewImages, setPreviewImages] = useState([]);

  // ✅ Load existing images on mount
  useEffect(() => {
    if (formData.gallery_images && Array.isArray(formData.gallery_images)) {
      const loadedImages = formData.gallery_images.map((img) => ({
        id: img.id || Date.now(),
        image: typeof img === "string" ? img : img.image,
        file: img.file || null,
        isNew: !img.id,
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
      id: Date.now() + Math.random(),
      image: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    const updatedImages = [...previewImages, ...newImages];
    setPreviewImages(updatedImages);

    const updatedFormData = {
      ...formData,
      gallery_images: [...(formData.gallery_images || []), ...newImages],
    };
    setFormData(updatedFormData);
    onUpdate(updatedFormData);
  };

  // ✅ Handle image deletion
  const handleDeleteImage = (index) => {
    const imageToDelete = previewImages[index];
    const updatedImages = previewImages.filter((_, i) => i !== index);

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

    setPreviewImages(updatedImages);
    setFormData((prev) => ({
      ...prev,
      gallery_images: updatedImages,
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
