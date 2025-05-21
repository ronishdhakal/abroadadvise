"use client";

import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";

const CollegeCard = ({ college }) => {
  if (!college) return null;

  return (
    <Link href={`/college/${college.slug}`} className="block h-full max-w-[100%] sm:max-w-none">
      <div className="h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100 flex flex-col group">

        {/* 📌 Mobile: Show Cover Photo | Desktop: Show Logo */}
        <div className="relative w-full overflow-hidden">
          {/* ✅ Mobile View: Show Cover Photo */}
          <div className="block sm:hidden w-full h-40 bg-gray-100">
            {college.cover_photo ? (
              <img
                src={college.cover_photo}
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
            {college.logo ? (
              <div className="w-full h-full relative">
                <img
                  src={college.logo || "/placeholder.svg"}
                  alt={college.name}
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
        </div>

        {/* 📌 Info Section */}
        <div className="p-4 flex-grow flex flex-col justify-center text-left">
          <h2 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 line-clamp-1 flex items-center gap-1">
            {college.name}
            {college.verified && (
              <BadgeCheck
                className="h-5 w-5 text-[#4c9bd5]"
                title="Verified College"
                aria-label="Verified College"
              />
            )}
          </h2>

          {/* ✅ Destination (Instead of address) */}
          {college.study_abroad_destinations?.length > 0 && (
            <div className="flex items-center text-gray-500 mt-2">
              <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
              <span className="text-xs sm:text-sm line-clamp-1">
                {college.study_abroad_destinations.map((d) => d.title).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CollegeCard;
