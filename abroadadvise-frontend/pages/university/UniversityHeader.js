"use client";

import { useState, useEffect } from "react";
import { MapPin, BadgeCheck, MessageSquare } from "lucide-react";
import InquiryModal from "@/components/InquiryModal";

const UniversityHeader = ({ university = {} }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const coverPhotoUrl = university?.cover_photo
    ? university.cover_photo.startsWith("http")
      ? university.cover_photo
      : `${API_BASE_URL}${university.cover_photo}`
    : null;

  const logoUrl = university?.logo
    ? university.logo.startsWith("http")
      ? university.logo
      : `${API_BASE_URL}${university.logo}`
    : null;

  const handleInquiry = () => {
    setSelectedEntity({
      entityType: "university",
      entityId: university?.id,
      entityName: university?.name,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden">
      {/* Cover Photo */}
      <div className="relative w-full max-w-[2000px] mx-auto flex items-center justify-center bg-gray-100">
        {coverPhotoUrl ? (
          <img
            src={coverPhotoUrl}
            alt="University Cover"
            className="w-full h-auto object-contain"
            style={{ maxWidth: "2000px" }}
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}
      </div>

      {/* University Info */}
      <div
        className={`relative w-full max-w-[2000px] bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl shadow-xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{ marginTop: "-2rem" }}
      >
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {logoUrl && (
            <div className="relative -mt-16 sm:-mt-24 w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1">
              <img
                src={logoUrl}
                alt={`${university?.name || "University"} logo`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          )}

          <div className="flex-1 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center flex-wrap">
              {university?.name || "Unnamed University"}
              {university?.verified && (
                <span
                  className="inline-flex ml-2 items-center"
                  title="Verified University"
                >
                  <BadgeCheck className="h-6 w-6 text-[#4c9bd5]" />
                </span>
              )}
            </h1>
            <div className="flex items-center text-gray-500 text-sm md:text-base mt-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-400" />
              <span>{university?.country || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Inquiry CTA */}
        <button
          onClick={handleInquiry}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#4c9bd5] hover:bg-[#3b8ac2] text-white font-medium rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:ring-opacity-50"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          <span className="font-semibold">Ask a Question</span>
        </button>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        entityId={selectedEntity?.entityId}
        entityName={selectedEntity?.entityName}
        entityType={selectedEntity?.entityType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default UniversityHeader;
