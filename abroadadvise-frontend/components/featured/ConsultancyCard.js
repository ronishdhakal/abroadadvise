"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Globe,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  UserCircle2,
} from "lucide-react";

const ConsultancyCard = ({ consultancy, onApply }) => {
  const [expanded, setExpanded] = useState(false);

  const handleInquiry = () => {
    if (onApply && consultancy) {
      onApply({
        entityType: "consultancy",
        entityId: consultancy.id,
        entityName: consultancy.name,
        consultancyId: consultancy.id,
        consultancyName: consultancy.name,
        destination: "Canada", // TODO: Make dynamic if needed
      });
    }
  };

  return (
    <div className="relative w-full max-w-[90%] sm:max-w-[400px] md:max-w-[450px] bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group mx-auto">
      {/* Cover Photo */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gray-100">
        {consultancy?.cover_photo ? (
          <img
            src={consultancy.cover_photo}
            alt={`${consultancy.name} cover`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic bg-gradient-to-br from-gray-50 to-gray-200">
            No Cover Photo
          </div>
        )}

        {/* Logo */}
        {consultancy?.logo && (
          <div className="absolute -bottom-8 left-4 sm:left-6 w-14 h-14 sm:w-16 sm:h-16 bg-white p-1.5 rounded-xl shadow-lg border-2 border-white group-hover:-translate-y-1 group-hover:shadow-xl transition">
            <img
              src={consultancy.logo}
              alt={`${consultancy.name} logo`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="pt-10 sm:pt-12 pb-4 px-4 sm:px-6 space-y-3 sm:space-y-4">
        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Link
            href={`/consultancy/${consultancy.slug}`}
            className="hover:text-[#4c9bd5] transition-colors duration-200"
            aria-label={`View details for ${consultancy.name}`}
          >
            {consultancy.name || "Unnamed Consultancy"}
          </Link>
          {consultancy?.verified && (
            <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#4c9bd5]" title="Verified Consultancy" />
          )}
        </h3>

        {/* Contact Info */}
        <div className="text-sm text-gray-600 space-y-2">
          {consultancy.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="line-clamp-1">{consultancy.address}</span>
            </div>
          )}
          {consultancy.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <a href={`tel:${consultancy.phone}`} className="text-[#4c9bd5] hover:underline">
                {consultancy.phone}
              </a>
            </div>
          )}
          {consultancy.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <a href={`mailto:${consultancy.email}`} className="text-[#4c9bd5] hover:underline break-all">
                {consultancy.email}
              </a>
            </div>
          )}
          {consultancy.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <a
                href={consultancy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4c9bd5] hover:underline break-all"
              >
                {consultancy.website}
              </a>
            </div>
          )}
        </div>

        {/* CTA */}
        {consultancy?.verified && (
          <button
            onClick={handleInquiry}
            className="w-full mt-3 px-5 py-2.5 bg-gradient-to-r from-[#4c9bd5] to-[#3a8cc1] text-white font-semibold rounded-xl shadow-md flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Apply
          </button>
        )}

        {/* Expandable About + View Profile */}
        {consultancy?.about && (
          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full sm:w-auto px-4 py-1.5 text-sm text-[#4c9bd5] font-medium rounded-full border border-[#4c9bd5]/30 bg-white hover:bg-[#f0faff] transition-all duration-300 hover:shadow-md"
            >
              {expanded ? (
                <>
                  Hide Details <ChevronUp className="h-4 w-4 inline-block ml-1" />
                </>
              ) : (
                <>
                  More Details <ChevronDown className="h-4 w-4 inline-block ml-1" />
                </>
              )}
            </button>

            <Link
              href={`/consultancy/${consultancy.slug}`}
              className="w-full sm:w-auto px-5 py-1.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#4c9bd5] to-[#3a8cc1] hover:shadow-md transition-all duration-300 flex items-center justify-center"
            >
              <UserCircle2 className="h-5 w-5 mr-1" />
              View Profile
            </Link>
          </div>
        )}

        {/* Expanded Description */}
        {expanded && consultancy.about && (
          <div
            className="text-sm text-gray-600 mt-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: consultancy.about }}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultancyCard;
