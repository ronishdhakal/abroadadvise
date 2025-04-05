"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // For animations

const ConsultancyGallery = ({ gallery }) => {
  if (!gallery || gallery.length === 0) return null;

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle navigation in modal
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
    setSelectedImage(gallery[(currentIndex + 1) % gallery.length].image);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    setSelectedImage(gallery[(currentIndex - 1 + gallery.length) % gallery.length].image);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Our Gallery</h2>

      {/* Scrollable Gallery */}
      <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="flex space-x-4 pb-4">
          {gallery.map((image, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image.image}
                alt={`Gallery ${index + 1}`}
                className="w-48 h-32 md:w-64 md:h-48 object-cover rounded-lg cursor-pointer shadow-md transition-all duration-300 hover:shadow-xl"
                onClick={() => {
                  setSelectedImage(image.image);
                  setCurrentIndex(index);
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative max-w-4xl w-full p-4">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-gray-900 bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation Buttons */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-900 bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-900 bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image */}
              <motion.img
                src={selectedImage}
                alt="Selected"
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Caption */}
              <div className="text-center text-white mt-4">
                <p className="text-sm opacity-80">
                  Image {currentIndex + 1} of {gallery.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultancyGallery;