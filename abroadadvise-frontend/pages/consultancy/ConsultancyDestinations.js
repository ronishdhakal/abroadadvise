"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const ConsultancyDestinations = ({ destinations, openInquiryModal, consultancyId, consultancyName, verified }) => { // ✅ Add verified prop
  const [showAll, setShowAll] = useState(false);

  if (!destinations || destinations.length === 0) return null;

  const visibleDestinations = showAll ? destinations : destinations.slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Study Abroad Destinations</h2>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleDestinations.map((dest) => (
          <div
            key={dest.id}
            className="flex flex-col items-start p-4 border rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition duration-200"
          >
            <Link href={`/destination/${dest.slug}`} className="flex items-center gap-3 w-full">
              <img
                src={dest.country_logo || "/placeholder-flag.png"}
                alt={dest.title}
                className="w-8 h-8 object-cover rounded-full border"
              />
              <span className="text-gray-800 font-medium">{dest.title}</span>
            </Link>

            {/* Apply Now Button (Conditional Display) */}
            {verified && ( // ✅ Show only if consultancy is verified
              <button
                onClick={() => openInquiryModal("destination", dest.id, dest.title, consultancyId, consultancyName)}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-md transition duration-200 w-full text-center"
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {destinations.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 flex items-center justify-center text-blue-600 hover:underline"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-5 w-5 mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5 mr-1" /> Show All ({destinations.length})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ConsultancyDestinations;
