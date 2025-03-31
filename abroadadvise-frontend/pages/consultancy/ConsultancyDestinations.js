"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const ConsultancyDestinations = ({
  destinations = [],
  openInquiryModal,
  consultancyId,
  consultancyName,
  verified,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!destinations || destinations.length === 0) return null;

  const visibleDestinations = showAll ? destinations : destinations.slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Study Abroad Destinations
      </h2>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleDestinations.map((dest) => (
          <div
            key={dest.id}
            className="flex flex-col p-4 rounded-xl bg-[#f7fbfd] hover:bg-[#eef6fb] border border-gray-200 transition-all shadow-sm"
          >
            {/* Destination Info */}
            <Link
              href={`/destination/${dest.slug || "#"}`}
              className="flex items-center gap-3 mb-3"
            >
              <img
                src={dest.country_logo || "/placeholder-flag.png"}
                alt={dest.title || "Destination"}
                className="w-9 h-9 object-cover rounded-full border"
              />
              <span className="text-gray-800 font-medium text-base line-clamp-1">
                {dest.title || "Untitled Destination"}
              </span>
            </Link>

            {/* Apply Now Button */}
            {verified && (
              <button
                onClick={() =>
                  openInquiryModal(
                    "destination",
                    dest.id,
                    dest.title,
                    consultancyId,
                    consultancyName
                  )
                }
                className="mt-auto px-4 py-2 bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white text-sm font-semibold rounded-lg shadow transition"
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show More / Less */}
      {destinations.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 flex items-center justify-center text-[#4c9bd5] font-medium hover:underline transition"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-5 w-5 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5 mr-1" />
              Show All ({destinations.length})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ConsultancyDestinations;
