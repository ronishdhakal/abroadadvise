"use client";

import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";

const UniversityCard = ({ university }) => {
  if (!university || typeof university !== "object") return null;

  const {
    slug = "",
    name = "Unnamed University",
    logo = null,
    cover_photo = null,
    country = "Unknown Country",
    moe_certified = false,
    verified = false,
  } = university;

  return (
    <Link
      href={`/university/${slug}`}
      className="block h-full max-w-full sm:max-w-none"
      aria-label={`View details about ${name}`}
    >
      <article className="h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100 flex flex-col group">
        {/* Cover with Logo Overlay */}
        <div className="relative w-full h-40 sm:h-48 md:h-44 lg:h-40 xl:h-36 bg-gray-100">
          {cover_photo ? (
            <img
              src={cover_photo}
              alt={`${name} cover`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
              <span className="text-gray-400 text-sm font-medium">No Cover Photo</span>
            </div>
          )}

          {/* Logo overlay */}
          {logo && (
            <div className="absolute -bottom-6 left-4 sm:left-5 w-14 h-14 sm:w-16 sm:h-16 bg-white p-1.5 rounded-xl shadow-md border border-white group-hover:-translate-y-1 transition">
              <img
                src={logo}
                alt={`${name} logo`}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}

          {/* MOE Certified Badge */}
          {moe_certified && (
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-white/95 backdrop-blur-sm text-green-600 text-xs font-medium px-2 py-0.5 rounded-full flex items-center shadow-sm border border-green-100 transition-transform duration-300 group-hover:scale-105">
                <BadgeCheck className="h-4 w-4 mr-1 text-green-600" />
                <span className="mt-px">MOE Certified</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="pt-10 pb-4 px-4 sm:px-5 flex-grow flex flex-col justify-center text-left">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1 flex items-center gap-1">
            {name}
            {verified && (
              <BadgeCheck
                className="h-5 w-5 text-[#4c9bd5]"
                title="Verified University"
                aria-label="Verified University"
              />
            )}
          </h2>

          <div className="flex items-center text-gray-500 mt-2">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-400" />
            <span className="text-xs sm:text-sm line-clamp-1">{country}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default UniversityCard;
