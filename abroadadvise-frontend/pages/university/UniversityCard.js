"use client";

import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";

const UniversityCard = ({ university }) => {
  return (
    <Link href={`/university/${university.slug}`} className="block h-full max-w-[100%] sm:max-w-none">
      <div className="h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100 flex flex-col group">
        
        {/* 📌 Mobile: Show Cover Photo | Desktop: Show Logo */}
        <div className="relative w-full overflow-hidden">
          {/* ✅ Mobile View: Show Cover Photo */}
          <div className="block sm:hidden w-full h-40 bg-gray-100">
            {university.cover_photo ? (
              <img
                src={university.cover_photo}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200">
                <span className="text-gray-400 text-sm font-medium">No Cover Photo</span>
              </div>
            )}
          </div>

          {/* ✅ Desktop View: Show Logo */}
          <div className="hidden sm:block w-full h-36 sm:h-48 md:h-44 lg:h-40 xl:h-36 overflow-hidden">
            {university.logo ? (
              <div className="w-full h-full relative">
                <img
                  src={university.logo || "/placeholder.svg"}
                  alt={university.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <span className="text-gray-400 text-sm font-medium">No Logo</span>
              </div>
            )}
          </div>

          {/* ✅ MOE Certified Badge (Appears on both Mobile & Desktop) */}
          {university.moe_certified && (
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-white/95 backdrop-blur-sm text-green-600 text-xs font-medium px-2 py-0.5 rounded-full flex items-center shadow-sm border border-green-100 transition-transform duration-300 group-hover:scale-105">
                <BadgeCheck className="h-4 w-4 mr-1 text-green-600" />
                <span className="mt-px">MOE Certified</span>
              </div>
            </div>
          )}
        </div>

        {/* 📌 Info Section - Left aligned */}
        <div className="p-4 flex-grow flex flex-col justify-center text-left">
          {/* ✅ Title - Slightly increased size */}
          <h2 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 line-clamp-1">
            {university.name}
          </h2>

          {/* ✅ Location */}
          <div className="flex items-center text-gray-500 mt-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
            <span className="text-xs sm:text-sm line-clamp-1">{university.country}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard;
