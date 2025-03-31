"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const ConsultancyUniversities = ({
  universities,
  openInquiryModal,
  consultancyId,
  consultancyName,
  verified,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!universities || universities.length === 0) return null;

  const visibleUniversities = showAll ? universities : universities.slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Partner Universities</h2>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleUniversities.map((university) => (
          <div
            key={university.id}
            className="flex flex-col items-start p-5 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <Link
              href={`/university/${university.slug}`}
              className="flex items-center gap-4 w-full"
            >
              <img
                src={university.logo || "/placeholder-university.png"}
                alt={university.name}
                className="w-12 h-12 object-cover rounded-md border border-gray-300"
              />
              <div>
                <p className="text-gray-800 font-semibold text-base">
                  {university.name}
                </p>
                <span className="text-sm text-gray-500">
                  {university.country || "Unknown Country"}
                </span>
              </div>
            </Link>

            {verified && (
              <button
                onClick={() =>
                  openInquiryModal(
                    "university",
                    university.id,
                    university.name,
                    consultancyId,
                    consultancyName
                  )
                }
                className="mt-4 w-full px-4 py-2 bg-[#4c9bd5] hover:bg-[#3b8ac2] text-white text-sm font-medium rounded-md transition duration-200"
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {universities.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 flex items-center justify-center text-[#4c9bd5] font-medium hover:underline"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-5 w-5 mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5 mr-1" /> Show All ({universities.length})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ConsultancyUniversities;
