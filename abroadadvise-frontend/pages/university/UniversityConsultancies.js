import { useState } from "react";

const UniversityConsultancies = ({ consultancies = [] }) => {  // ✅ Default to an empty array
  const [showAll, setShowAll] = useState(false);

  // ✅ Ensure consultancies is an array
  const visibleConsultancies = showAll ? consultancies : consultancies.slice(0, 5); 

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply Through</h2>

      {/* Consultancies List */}
      <div className="space-y-3">
        {visibleConsultancies.length > 0 ? (
          visibleConsultancies.map((consultancy) => (
            <div key={consultancy.id} className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
              {/* Left Side: Logo & Name */}
              <div className="flex items-center gap-3">
                {/* Consultancy Logo */}
                {consultancy.logo ? (
                  <img src={consultancy.logo} alt={consultancy.name} className="h-10 w-10 object-cover rounded-md" />
                ) : (
                  <div className="h-10 w-10 bg-gray-300 rounded-md"></div> // Placeholder for missing logo
                )}

                {/* Consultancy Name & Location */}
                <div>
                  <p className="text-sm font-medium text-gray-800">{consultancy.name}</p>
                  <p className="text-xs text-gray-500">{consultancy.address || "Location not available"}</p>
                </div>
              </div>

              {/* Apply Now Button */}
              <a
                href={`/consultancy/${consultancy.slug}`}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Apply Now
              </a>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No consultancies available for this university.</p>
        )}
      </div>

      {/* Show More / Show Less Button */}
      {consultancies.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 text-sm font-medium text-blue-600 hover:underline flex items-center justify-center"
        >
          {showAll ? "Show Less" : `Show All (${consultancies.length})`}
        </button>
      )}
    </div>
  );
};

export default UniversityConsultancies;
