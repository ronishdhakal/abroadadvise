"use client";

import { useState } from "react";
import { X } from "lucide-react";

const ConsultancyGallery = ({ gallery }) => {
  if (!gallery || gallery.length === 0) return null; // ✅ Prevent crash if gallery is undefined

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Gallery</h2>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {gallery.map((image, index) => (
          <img
            key={index}
            src={image.image}
            alt={`Gallery ${index + 1}`}
            className="w-full h-28 md:h-40 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedImage(image.image)}
          />
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultancyGallery;
