"use client";

import { useState, useEffect } from "react";
import { X, Upload, Trash } from "lucide-react";
import { updateConsultancyDashboard } from "@/utils/api";

const ConsultancyGallery = ({ formData, setFormData }) => {
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

    setPreviewImages((prev) => [...prev, ...newImages]);
    setFormData((prev) => ({
      ...prev,
      gallery_images: [...prev.gallery_images, ...newImages],
    }));
  };

  // ✅ Handle image deletion
  const handleDeleteImage = (index) => {
    const imageToDelete = previewImages[index];
    let updatedImages = previewImages.filter((_, i) => i !== index);

    if (!imageToDelete.isNew) {
      setFormData((prev) => ({
        ...prev,
        deleted_gallery_images: [...(prev.deleted_gallery_images || []), imageToDelete.id],
      }));
    }

    setPreviewImages(updatedImages);
    setFormData((prev) => ({
      ...prev,
      gallery_images: updatedImages,
    }));
  };

  // ✅ Handle update request (ONLY updates gallery)
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = new FormData();

      previewImages.forEach((img) => {
        if (img.file) {
          updateData.append("gallery_images", img.file);
        }
      });

      if (formData.deleted_gallery_images?.length) {
        updateData.append("deleted_gallery_images", JSON.stringify(formData.deleted_gallery_images));
      }

      // ✅ API Call: Only update gallery images
      await updateConsultancyDashboard(updateData);

      setSuccessMessage("Gallery updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gallery</h2>

      {/* Upload Button */}
      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center shadow-lg transition duration-200 hover:shadow-xl w-full">
        <Upload className="h-5 w-5 mr-2" />
        Upload Images
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
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

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Gallery"}
      </button>

      {/* Success & Error Messages */}
      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default ConsultancyGallery;
