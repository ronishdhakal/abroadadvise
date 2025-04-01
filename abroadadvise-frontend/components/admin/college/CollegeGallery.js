"use client";

import { useState, useEffect } from "react";
import { X, Upload, Trash } from "lucide-react";

const CollegeGallery = ({ formData, setFormData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (formData.gallery_images && formData.gallery_images.length > 0) {
      const loadedImages = formData.gallery_images.map((img) => ({
        id: img.id || Date.now(),
        image: typeof img === "string" ? img : img.image,
        file: img.file || null,
        isNew: !img.id,
      }));
      setPreviewImages(loadedImages);
    }
  }, [formData.gallery_images]);

  useEffect(() => {
    return () => {
      previewImages.forEach((img) => {
        if (img.file) {
          URL.revokeObjectURL(img.image);
        }
      });
    };
  }, [previewImages]);

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

  const handleDeleteImage = (index) => {
    const imageToDelete = previewImages[index];

    if (imageToDelete.isNew) {
      const updatedImages = previewImages.filter((_, i) => i !== index);
      setPreviewImages(updatedImages);
      setFormData((prev) => ({
        ...prev,
        gallery_images: updatedImages,
      }));
      return;
    }

    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    setFormData((prev) => ({
      ...prev,
      gallery_images: updatedImages,
      deleted_gallery_images: [...(prev.deleted_gallery_images || []), imageToDelete.id],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gallery</h2>

      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center shadow-lg transition duration-200 hover:shadow-xl w-full">
        <Upload className="h-5 w-5 mr-2" />
        Upload Images
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {previewImages.map((image, index) => (
            <div key={image.id} className="relative">
              <img
                src={image.image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-28 md:h-40 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedImage(image.image)}
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

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
            >
              <X className="h-6 w-6" />
            </button>
            <img src={selectedImage} alt="Selected" className="max-w-full max-h-[90vh] rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeGallery;
