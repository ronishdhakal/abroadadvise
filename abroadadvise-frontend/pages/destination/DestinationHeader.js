"use client";

import { MessageSquare, Globe, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";

const DestinationHeader = ({ destination = {}, setIsModalOpen, setSelectedEntity }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInquiry = () => {
    if (!setSelectedEntity || !setIsModalOpen || !destination?.id || !destination?.title) {
      console.error("Required data or functions are missing for inquiry.");
      return;
    }

    setSelectedEntity({
      entityType: "destination",
      entityId: destination.id,
      entityName: destination.title,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden">
      {/* ✅ Fixed Cover Photo Section - Ensures No Cropping */}
      <div className="relative w-full max-w-[2000px] mx-auto flex items-center justify-center bg-gray-100">
        {destination?.cover_page ? (
          <img
            src={destination.cover_page}
            alt="Cover"
            className="w-full h-auto"
            style={{
              maxWidth: "2000px",
              height: "auto",
              objectFit: "contain",
            }}
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Image Available</span>
          </div>
        )}
      </div>

      {/* ✅ Destination Info Section */}
      <div
        className={`relative w-full max-w-[2000px] bg-white px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl shadow-xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{ marginTop: "-2rem" }}
      >
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {destination?.country_logo && (
            <div className="relative -mt-16 sm:-mt-24 w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <img
                src={destination.country_logo}
                alt={`${destination?.title || "Destination"} logo`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          )}

          <div className="flex-1 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center flex-wrap">
              Study in {destination?.title || "Destination"} from Nepal
              {destination?.is_verified && (
                <span className="inline-flex ml-2 items-center" title="Verified Destination">
                  <BadgeCheck className="h-6 w-6 md:h-7 md:w-7 text-blue-500" />
                </span>
              )}
            </h1>
            <div className="flex items-center text-gray-500 text-sm md:text-base mt-2">
              <Globe className="h-5 w-5 md:h-6 md:w-6 mr-2 flex-shrink-0 text-gray-400" />
              <span className="line-clamp-1">International Education Destination</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleInquiry}
          className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          <span className="font-semibold">Inquire</span>
        </button>
      </div>
    </div>
  );
};

export default DestinationHeader;
