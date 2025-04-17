"use client";

import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";

const ConsultancyCard = ({ consultancy }) => {
  if (!consultancy) return null;

  const {
    name,
    slug,
    address,
    logo,
    cover_photo,
    verified,
    moe_certified,
  } = consultancy;

  return (
    <Link
      href={`/consultancy/${slug}`}
      className="block h-full max-w-full sm:max-w-none"
      aria-label={`View details about ${name}`}
    >
      <article className="h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100 flex flex-col group">
        {/* Banner with Cover and Logo */}
        <div className="relative w-full h-40 sm:h-48 md:h-44 lg:h-40 xl:h-36 bg-gray-100">
          {cover_photo ? (
            <img
              src={cover_photo}
              alt={`${name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200">
              <span className="text-gray-400 text-sm font-medium">No Cover Photo</span>
            </div>
          )}

          {/* Logo inside banner */}
          {logo && (
            <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 bg-white p-1.5 rounded-xl shadow-md">
              <img
                src={logo}
                alt={`${name} logo`}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
          )}

          {/* MOE Certified Badge */}
          {moe_certified && (
            <div className="absolute top-3 right-3 z-10">
              <div
                className="bg-white/95 backdrop-blur-sm text-green-600 text-xs font-medium px-2 py-0.5 rounded-full flex items-center shadow-sm border border-green-100 transition-transform duration-300 group-hover:scale-105"
                aria-label="MOE Certified Consultancy"
              >
                <BadgeCheck className="h-4 w-4 mr-1 text-green-600" />
                <span className="mt-px">MOE Certified</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4 flex-grow flex flex-col justify-center text-left">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1 flex items-center gap-1">
            {name}
            {verified && (
              <BadgeCheck
                className="h-5 w-5 text-[#4c9bd5]"
                title="Verified Consultancy"
                aria-label="Verified Consultancy"
              />
            )}
          </h3>

          {address && (
            <div className="flex items-center text-gray-500 mt-2">
              <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
              <span className="text-xs sm:text-sm line-clamp-1">{address}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ConsultancyCard;
