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
    onApply &&
      onApply({
        entityType: "consultancy",
        entityId: consultancy.id,
        entityName: consultancy.name,
        consultancyId: consultancy.id,
        consultancyName: consultancy.name,
        destination: "Canada", // ✅ Make dynamic if needed
      });
  };

  return (
    <div className="relative w-full max-w-[90%] sm:max-w-[400px] md:max-w-[450px] bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group mx-auto">
      {/* Cover Photo */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gray-100">
        {consultancy.cover_photo ? (
          <img
            src={consultancy.cover_photo}
            alt={consultancy.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm italic font-light">No Cover Photo</span>
          </div>
        )}

        {/* Logo Overlay */}
        {consultancy.logo && (
          <div className="absolute -bottom-8 left-4 sm:left-6 w-14 h-14 sm:w-16 sm:h-16 bg-white p-1.5 rounded-xl shadow-lg border-2 border-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
            <img
              src={consultancy.logo}
              alt={`${consultancy.name} logo`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="pt-10 sm:pt-12 pb-4 px-4 sm:px-6 space-y-3 sm:space-y-4">
        {/* Name & Verification */}
        <div className="flex items-center justify-between">
          <Link
            href={`/consultancy/${consultancy.slug}`}
            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-[#4c9bd5] transition-colors duration-200 flex items-center gap-2"
          >
            <h3 className="inline-flex items-center">
              {consultancy.name}
              {consultancy.verified && (
                <span className="ml-2" title="Verified Consultancy">
                  <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#4c9bd5]" />
                </span>
              )}
            </h3>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-600 space-y-2">
          {consultancy.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-1">{consultancy.address}</span>
            </div>
          )}
          {consultancy.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <a
                href={`tel:${consultancy.phone}`}
                className="text-[#4c9bd5] hover:text-[#3a8cc1] transition-colors duration-200"
              >
                {consultancy.phone}
              </a>
            </div>
          )}
          {consultancy.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <a
                href={`mailto:${consultancy.email}`}
                className="text-[#4c9bd5] hover:text-[#3a8cc1] transition-colors duration-200 truncate"
              >
                {consultancy.email}
              </a>
            </div>
          )}
          {consultancy.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <a
                href={consultancy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4c9bd5] hover:text-[#3a8cc1] transition-colors duration-200 truncate"
              >
                {consultancy.website}
              </a>
            </div>
          )}
        </div>

        {/* CTA Button */}
        {consultancy.verified && (
          <button
            onClick={handleInquiry}
            className="w-full mt-3 px-5 py-2.5 bg-gradient-to-r from-[#4c9bd5] to-[#3a8cc1] text-white font-semibold rounded-xl shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:ring-opacity-50 active:scale-95"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Apply
          </button>
        )}

        {/* Expandable About & Profile Link */}
        {consultancy.about && (
          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full sm:w-auto px-4 py-1.5 text-sm text-[#4c9bd5] font-medium rounded-full bg-white border border-[#4c9bd5]/20 hover:border-[#4c9bd5] hover:bg-[#4c9bd5]/5 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:text-[#3a8cc1] focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:ring-opacity-50"
            >
              {expanded ? (
                <>
                  Hide Details <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  More Details <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>

            <Link
              href={`/consultancy/${consultancy.slug}`}
              className="w-full sm:w-auto px-5 py-1.5 text-sm text-white font-semibold rounded-full bg-gradient-to-r from-[#4c9bd5] to-[#3a8cc1] flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:ring-opacity-50 active:scale-95"
            >
              <UserCircle2 className="h-5 w-5" />
              View Profile
            </Link>
          </div>
        )}

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