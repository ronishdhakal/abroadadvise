"use client"

import { MessageSquare, MapPin, BadgeCheck } from "lucide-react"
import { useState, useEffect } from "react"

const ConsultancyHeader = ({ consultancy, setIsModalOpen, setSelectedEntity }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleInquiry = () => {
    setSelectedEntity({
      entityType: "consultancy",
      entityId: consultancy.id,
      entityName: consultancy.name,
    })
    setIsModalOpen(true)
  }

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden mb-0">
      {/* Fixed Cover Photo Section: Ensures Image Resizes Proportionally */}
      <div className="relative w-full max-w-[1000px] md:max-w-[1200px] lg:max-w-[1400px] mx-auto overflow-hidden">
        {consultancy.cover_photo ? (
          <img
            src={consultancy.cover_photo}
            alt="Cover"
            className="w-full h-auto transition-transform duration-700 ease-out"
            style={{
              maxHeight: "400px",
              width: "100%",
              display: "block",
              transform: isScrolled ? "scale(1.05)" : "scale(1)", // ✅ Zoom-in effect on scroll
              opacity: isScrolled ? 1 : 0.9, // ✅ Smooth opacity transition
            }}
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}

        {/* Background Limited to the Image Area */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-black/10 pointer-events-none"></div>
      </div>

      <div
        className={`relative w-full max-w-[1000px] md:max-w-[1200px] lg:max-w-[1400px] bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl shadow-xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{ marginTop: "-2rem", marginBottom: "0" }} // ✅ Ensures no extra margin
      >
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {consultancy.logo && (
            <div className="relative -mt-16 sm:-mt-24 w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
              <img
                src={consultancy.logo}
                alt={`${consultancy.name} logo`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          )}

          <div className="flex-1 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center flex-wrap">
              {consultancy.name}
              {consultancy.is_verified && (
                <span className="inline-flex ml-2 items-center" title="Verified Consultancy">
                  <BadgeCheck className="h-6 w-6 md:h-7 md:w-7 text-blue-500" />
                </span>
              )}
            </h1>
            <div className="flex items-center text-gray-500 text-sm md:text-base mt-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 text-gray-400" />
              <span className="line-clamp-1">{consultancy.address}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleInquiry}
          className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          <span className="font-semibold">Ask a Question</span>
        </button>
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
  )
}

export default ConsultancyHeader
