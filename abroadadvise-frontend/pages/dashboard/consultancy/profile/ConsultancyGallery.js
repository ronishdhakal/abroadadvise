"use client";

import { useState, useEffect } from "react";
import { Upload, Trash } from "lucide-react";

const ConsultancyGallery = ({ formData, setFormData, onUpdate }) => {
  if (!formData) return null;

  const [previewImages, setPreviewImages] = useState([]);

  // ✅ Load existing images (API returns them as { id, image })
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

  // ✅ Cleanup object URLs
  useEffect(() => {
    return () => {
      previewImages.forEach((img) => {
        if (img.file && typeof img.image === "string") {
          URL.revokeObjectURL(img.image);
        }
      });
    };
  }, [previewImages]);

  // ✅ Add image previews and update local formData (used for tracking)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      image: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    const updatedPreview = [...previewImages, ...newImages];
    setPreviewImages(updatedPreview);

    // ✅ Only track the preview locally; actual file is appended during update
    setFormData((prev) => ({
      ...prev,
      gallery_images: updatedPreview,
    }));

    onUpdate({ gallery_images: updatedPreview }); // ✅ Inform parent
  };

  // ✅ Handle delete (mark existing image for deletion or remove new one)
  const handleDeleteImage = (index) => {
    const imageToDelete = previewImages[index];
    const updatedImages = previewImages.filter((_, i) => i !== index);

    setPreviewImages(updatedImages);

    if (!imageToDelete.isNew) {
      const updatedDeleted = [...(formData.deleted_gallery_images || []), imageToDelete.id];
      setFormData((prev) => ({
        ...prev,
        gallery_images: updatedImages,
        deleted_gallery_images: updatedDeleted,
      }));
      onUpdate({ gallery_images: updatedImages, deleted_gallery_images: updatedDeleted });
    } else {
      setFormData((prev) => ({
        ...prev,
        gallery_images: updatedImages,
      }));
      onUpdate({ gallery_images: updatedImages });
    }
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
          {previewImages.map((img, index) => (
            <div key={img.id} className="relative">
              <img
                src={img.image}
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
