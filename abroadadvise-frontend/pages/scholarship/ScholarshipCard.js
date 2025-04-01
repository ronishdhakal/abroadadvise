"use client";

import Link from "next/link";
import { CalendarDays, MapPin, GraduationCap, XCircle } from "lucide-react";

const ScholarshipCard = ({ scholarship }) => {
  if (!scholarship || !scholarship.is_published) return null;

  const today = new Date();
  const activeFrom = new Date(scholarship.active_from);
  const activeTo = new Date(scholarship.active_to);
  const isClosed = activeTo < today;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden">
      <Link href={`/scholarship/${scholarship.slug}`} passHref>
        <div>
          {/* 📸 Featured Image */}
          <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
            {scholarship.featured_image ? (
              <img
                src={scholarship.featured_image}
                alt={scholarship.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}

            {/* 🎓 Study Level Badge */}
            {scholarship.study_level && (
              <div className="absolute top-2 left-2 bg-[#4c9bd5] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {scholarship.study_level.charAt(0).toUpperCase() +
                  scholarship.study_level.slice(1)}
              </div>
            )}

            {/* ❌ Closed Badge */}
            {isClosed && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center">
                <XCircle className="inline-block w-3 h-3 mr-1" />
                Closed
              </div>
            )}
          </div>

          {/* 📄 Info Section */}
          <div className="p-5">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
              {scholarship.title}
            </h2>

            {/* By */}
            {scholarship.by && (
              <p className="text-sm text-gray-600 line-clamp-1 mb-1">
                <span className="font-medium text-gray-500">By:</span>{" "}
                {scholarship.by}
              </p>
            )}

            {/* Destination */}
            {scholarship.destination && (
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                {scholarship.destination.title}
              </div>
            )}

            {/* Active Period */}
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
              {scholarship.active_from} - {scholarship.active_to}
            </div>

            {/* CTA Button */}
            <div className="mt-4">
              <button
                className={`w-full font-medium py-2 rounded-lg transition ${
                  isClosed
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#4c9bd5] hover:bg-[#3b87c4] text-white"
                }`}
                disabled={isClosed}
              >
                {isClosed ? "Scholarship Closed" : "View Details"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ScholarshipCard;
