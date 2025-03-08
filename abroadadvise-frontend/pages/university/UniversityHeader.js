"use client";

import { useState, useEffect } from "react";
import { MapPin, BadgeCheck } from "lucide-react";

const UniversityHeader = ({ university }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Construct image URLs
  const coverPhotoUrl = university.cover_photo
    ? university.cover_photo.startsWith("http")
      ? university.cover_photo
      : `${process.env.NEXT_PUBLIC_API_URL}${university.cover_photo}`
    : null;

  const logoUrl = university.logo
    ? university.logo.startsWith("http")
      ? university.logo
      : `${process.env.NEXT_PUBLIC_API_URL}${university.logo}`
    : null;

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden mb-0">
      {/* Cover Photo - Proportional Scaling with Animation */}
      <div className="relative w-full max-w-[1000px] md:max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto overflow-hidden">
        {coverPhotoUrl ? (
          <img
            src={coverPhotoUrl}
            alt="Cover"
            className="w-full h-auto transition-transform duration-700 ease-out"
            style={{
              maxHeight: "400px",
              width: "100%",
              display: "block",
              transform: isScrolled ? "scale(1.05)" : "scale(1)", // ✅ Smooth zoom effect
              opacity: isScrolled ? 1 : 0.9, // ✅ Smooth opacity transition
            }}
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}

        {/* Dark Overlay - Ensures Readability */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-black/10 pointer-events-none"></div>
      </div>

      {/* Header Info */}
      <div
        className={`relative w-full max-w-[1000px] md:max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl shadow-xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{ marginTop: "-2rem", marginBottom: "0" }}
      >
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {/* University Logo with Animation */}
          {logoUrl && (
            <div className="relative -mt-16 sm:-mt-24 w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 animate-floating">
              <img
                src={logoUrl}
                alt={`${university.name} logo`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          )}

          {/* University Name & Country */}
          <div className="flex-1 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center flex-wrap">
              {university.name}
              {university.verified && (
                <span className="inline-flex ml-2 items-center" title="Verified University">
                  <BadgeCheck className="h-6 w-6 md:h-7 md:w-7 text-blue-500" />
                </span>
              )}
            </h1>
            <div className="flex items-center text-gray-500 text-sm md:text-base mt-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 text-gray-400" />
              <span className="line-clamp-1">{university.country}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Ensure No Cropping on Mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          img {
            max-height: auto !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UniversityHeader;
