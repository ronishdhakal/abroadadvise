"use client";

const UniversityFacilities = ({ university = {} }) => {
  const facilitiesHTML = university?.facilities_features || "";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl mx-auto mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">University Facilities</h2>

      {/* Facilities and Features Section */}
      <div className="text-sm text-gray-700">
        {facilitiesHTML?.trim() ? (
          <div
            dangerouslySetInnerHTML={{ __html: facilitiesHTML }}
            className="prose prose-sm sm:prose-md"
          />
        ) : (
          <p className="text-gray-500">No facilities or features listed for this university.</p>
        )}
      </div>
    </div>
  );
};

export default UniversityFacilities;
