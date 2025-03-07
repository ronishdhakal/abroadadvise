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

  // Early return if university data is not yet available
  if (!university) {
    return <div>Loading...</div>; // Show loading state if university is not yet fetched
  }

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden">
      {/* Cover Photo */}
      <div className="relative w-full max-w-[2000px] mx-auto h-[400px] overflow-hidden">
        {/* Check if cover_photo exists */}
        {university.cover_photo ? (
          <img
            src={university.cover_photo}  // Full URL will be added by the backend
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              maxWidth: "2000px",
              maxHeight: "400px",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transform: isScrolled ? "translateY(-5%)" : "translateY(0)",
              transition: "transform 0.5s ease-out",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-black/10"></div>
      </div>

      {/* Header Info */}
      <div
        className={`relative w-full max-w-[2000px] bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl shadow-xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{ marginTop: "-2rem" }}
      >
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {/* University Logo */}
          {university.logo && (
            <div className="relative -mt-16 sm:-mt-24 w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <img
                src={university.logo}
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
    </div>
  );
};

export default UniversityHeader;
