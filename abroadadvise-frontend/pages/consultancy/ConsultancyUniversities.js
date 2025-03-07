"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const ConsultancyUniversities = ({ universities }) => {
  const [showAll, setShowAll] = useState(false);

  // Ensure universities are available before slicing
  if (!universities || universities.length === 0) return null;

  const visibleUniversities = showAll ? universities : universities.slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Partner Universities</h2>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleUniversities.map((university) => (
          <Link 
            key={university.id} 
            href={`/university/${university.slug}`} 
            className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition duration-200"
          >
            {/* University Logo */}
            <img
              src={university.logo || "/placeholder-university.png"}
              alt={university.name}
              className="w-12 h-12 object-cover rounded-md border"
            />

            {/* University Info */}
            <div>
              <p className="text-gray-800 font-semibold">{university.name}</p>
              <span className="text-gray-500 text-sm">{university.country || "Unknown Country"}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More/Less Button */}
      {universities.length > 6 && (
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
              <ChevronDown className="h-5 w-5 mr-1" /> Show All ({universities.length})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ConsultancyUniversities;
