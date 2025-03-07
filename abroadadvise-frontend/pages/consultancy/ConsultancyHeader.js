"use client"

import { MessageSquare, MapPin, BadgeCheck } from "lucide-react"
import { useState, useEffect } from "react"

const ConsultancyHeader = ({ consultancy, setIsModalOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  // Add scroll effect for enhanced visual experience
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden">
      {/* Cover Photo with parallax effect and enhanced styling */}
      <div className="relative h-[280px] sm:h-[320px] md:h-[380px] w-full overflow-hidden">
        {consultancy.cover_photo ? (
          <img
            src={consultancy.cover_photo || "/placeholder.svg?height=800&width=1600"}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            style={{
              transform: isScrolled ? "translateY(-5%)" : "translateY(0)",
              transition: "transform 0.5s ease-out",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}

        {/* Enhanced gradient overlay with more depth and dimension */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/10"></div>
      </div>

      {/* Consultancy Info Section - Redesigned with better spacing and elevation */}
      <div
        className={`relative w-full bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl shadow-xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{
          marginTop: "-2rem",
        }}
      >
        {/* Left Section: Logo + Name with improved layout */}
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {/* Logo with enhanced presentation and elevation */}
          {consultancy.logo && (
            <div
              className="relative -mt-16 sm:-mt-24 w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={consultancy.logo || "/placeholder.svg?height=200&width=200"}
                alt={`${consultancy.name} logo`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          )}

          <div className="flex-1 pt-2 sm:pt-0">
            {/* Consultancy Name with verification badge */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center flex-wrap">
              {consultancy.name}
              {consultancy.is_verified && (
                <span className="inline-flex ml-2 items-center" title="Verified Consultancy">
                  <BadgeCheck className="h-6 w-6 md:h-7 md:w-7 text-blue-500" />
                </span>
              )}
            </h1>

            {/* Address with improved styling */}
            <div className="flex items-center text-gray-500 text-sm md:text-base mt-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 text-gray-400" />
              <span className="line-clamp-1">{consultancy.address}</span>
            </div>
          </div>
        </div>

        {/* Inquiry Button with enhanced styling and animation */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          style={{
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
          }}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          <span className="font-semibold">Ask a Question</span>
        </button>
      </div>
    </div>
  )
}

export default ConsultancyHeader

