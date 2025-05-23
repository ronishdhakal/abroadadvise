"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ConsultancyDestinations = ({
  destinations = [],
  openInquiryModal,
  consultancyId,
  consultancyName,
  verified,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!Array.isArray(destinations) || destinations.length === 0) return null;

  const visibleDestinations = showAll ? destinations : destinations.slice(0, 6);

  return (
    <section
      className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
      aria-labelledby="consultancy-destinations-heading"
    >
      <h2
        id="consultancy-destinations-heading"
        className="text-xl font-semibold text-gray-800 mb-5"
      >
        Study Abroad Destinations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleDestinations.map((dest) => (
          <div
            key={dest.id}
            className="flex flex-col p-4 rounded-xl bg-[#f7fbfd] hover:bg-[#eef6fb] border border-gray-200 transition-all shadow-sm"
          >
            {/* Destination Link */}
            <Link
              href={`/destination/${dest.slug || "#"}`}
              className="flex items-center gap-3 mb-3"
              aria-label={`View details about ${dest.title || "destination"}`}
            >
              <img
                src={dest.country_logo || "/placeholder-flag.png"}
                alt={dest.title ? `${dest.title} Flag` : "Destination flag"}
                className="w-9 h-9 object-cover rounded-full border"
                loading="lazy"
              />
              <span className="text-gray-800 font-medium text-base line-clamp-1">
                {dest.title || "Untitled Destination"}
              </span>
            </Link>

            {/* Apply Now */}
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
                aria-label={`Apply to ${dest.title}`}
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Toggle Show All / Less */}
      {destinations.length > 6 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center px-5 py-2 bg-[#4c9bd5] text-white text-sm font-medium rounded-full hover:bg-[#3a8cc1] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            aria-label={showAll ? "Show fewer destinations" : "Show all destinations"}
          >
            {showAll ? (
              <>
                <ChevronUpIcon className="h-5 w-5 mr-2 transform group-hover:-translate-y-0.5 transition-transform duration-300" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-5 w-5 mr-2 transform group-hover:translate-y-0.5 transition-transform duration-300" />
                Show All ({destinations.length})
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default ConsultancyDestinations;
