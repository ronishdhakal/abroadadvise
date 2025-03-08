"use client";

import { useState, useEffect } from "react";
import { GraduationCap, MessageSquare } from "lucide-react";
import InquiryModal from "@/components/InquiryModal"; // ✅ Importing InquiryModal

const CourseHeader = ({ course }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Construct full URLs for images
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const coverImage = course.cover_image
    ? course.cover_image.startsWith("http")
      ? course.cover_image
      : `${API_BASE_URL}${course.cover_image}`
    : null;

  const courseIcon = course.icon
    ? course.icon.startsWith("http")
      ? course.icon
      : `${API_BASE_URL}${course.icon}`
    : null;

  // ✅ Handle Inquiry Modal
  const handleInquiry = () => {
    setSelectedEntity({
      entityType: "course",
      entityId: course.id,
      entityName: course.name,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden">
      {/* ✅ Full Image Display Without Cropping */}
      <div className="relative w-full max-w-[2000px] mx-auto flex items-center justify-center bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt="Course Cover"
            className="w-full h-auto"
            style={{
              maxWidth: "2000px",
              height: "auto",
              objectFit: "contain", // ✅ Ensures full image is visible, no cropping
            }}
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}
      </div>

      {/* ✅ Course Info Section */}
      <div
        className={`relative w-full max-w-[2000px] bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl shadow-xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{ marginTop: "-2rem" }}
      >
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {courseIcon && (
            <div className="relative -mt-16 sm:-mt-24 w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <img
                src={courseIcon}
                alt={`${course.name} Icon`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          )}

          <div className="flex-1 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center flex-wrap">
              {course.name}
              {course.abbreviation && <span className="ml-2 text-lg text-gray-500">({course.abbreviation})</span>}
            </h1>
            <div className="flex items-center text-gray-500 text-sm md:text-base mt-2">
              <GraduationCap className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 text-gray-400" />
              <span>{course.university?.name}</span>
            </div>
          </div>
        </div>

        {/* ✅ Inquire Button - Opens Inquiry Modal */}
        <button
          onClick={handleInquiry}
          className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          <span className="font-semibold">Inquire</span>
        </button>
      </div>

      {/* ✅ Inquiry Modal */}
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

export default CourseHeader;
