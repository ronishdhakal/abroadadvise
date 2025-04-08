"use client";

import { MessageSquare, MapPin, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";

const ConsultancyHeader = ({ consultancy, setIsModalOpen, setSelectedEntity }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!consultancy) return null;

  const handleInquiry = () => {
    setSelectedEntity({
      entityType: "consultancy",
      entityId: consultancy.id,
      entityName: consultancy.name,
    });
    setIsModalOpen(true);
  };

  return (
    <header className="relative w-full flex flex-col justify-end overflow-hidden" aria-labelledby="consultancy-header-title">
      {/* ✅ Cover Image */}
      <div className="relative w-full max-w-[2000px] mx-auto flex items-center justify-center bg-gray-100">
        {consultancy.cover_photo ? (
          <img
            src={consultancy.cover_photo}
            alt={`${consultancy.name} cover image`}
            loading="lazy"
            className="w-full h-auto object-contain"
            style={{ maxHeight: "450px" }}
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}
      </div>

      {/* ✅ Info Card */}
      <div
        className={`relative w-full max-w-[2000px] bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{ marginTop: "-2.5rem" }}
      >
        {/* Left: Logo and Info */}
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {consultancy.logo && (
            <div className="relative -mt-16 sm:-mt-24 w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <img
                src={consultancy.logo}
                alt={`${consultancy.name} logo`}
                loading="lazy"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          )}

          {/* Name and Location */}
          <div className="flex-1 pt-2 sm:pt-0">
            <h1
              id="consultancy-header-title"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center flex-wrap"
            >
              {consultancy.name}
              {consultancy.verified && (
                <span className="ml-2" title="Verified Consultancy" aria-label="Verified Consultancy">
                  <BadgeCheck className="h-6 w-6 md:h-7 md:w-7 text-[#4c9bd5]" />
                </span>
              )}
            </h1>

            {consultancy.address && (
              <div className="flex items-center text-gray-500 text-sm md:text-base mt-2">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <span className="line-clamp-1">{consultancy.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        {consultancy.verified && (
          <button
            onClick={handleInquiry}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white font-medium rounded-xl shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:ring-opacity-50"
            aria-label={`Inquire about ${consultancy.name}`}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            <span>Ask a Question</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default ConsultancyHeader;
