"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ConsultancyGallery = ({ gallery = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!Array.isArray(gallery) || gallery.length === 0) return null;

  // Keyboard support for modal (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % gallery.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(gallery[nextIndex].image);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(gallery[prevIndex].image);
  };

  return (
    <section
      className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg"
      aria-labelledby="consultancy-gallery-heading"
    >
      <h2
        id="consultancy-gallery-heading"
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Explore Our Gallery
      </h2>

      {/* Scrollable Gallery Thumbnails */}
      <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="flex space-x-4 pb-4">
          {gallery.map((img, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={img.image || "/placeholder-gallery.png"}
                alt={`Gallery image ${index + 1}`}
                loading="lazy"
                className="w-48 h-32 md:w-64 md:h-48 object-cover rounded-lg cursor-pointer shadow-md transition-all duration-300 hover:shadow-xl"
                onClick={() => {
                  setSelectedImage(img.image);
                  setCurrentIndex(index);
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery image ${currentIndex + 1}`}
          >
            <div className="relative max-w-4xl w-full p-4">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-gray-900 bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all z-10"
                aria-label="Close image viewer"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation Arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-900 bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-900 bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Fullscreen Image */}
              <motion.img
                src={selectedImage}
                alt={`Gallery image ${currentIndex + 1}`}
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
    </section>
  );
};

export default ConsultancyGallery;
