"use client";

const UniversityEligibility = ({ university = {} }) => {
  const eligibilityHTML = university?.eligibility || "";

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-5 border max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Eligibility Criteria</h2>

      {/* ✅ Safe Eligibility Rendering */}
      <div className="text-sm text-gray-700">
        {eligibilityHTML?.trim() ? (
          <div
            dangerouslySetInnerHTML={{ __html: eligibilityHTML }}
            className="prose prose-sm sm:prose-md text-gray-700"
          />
        ) : (
          <p className="text-gray-500">No eligibility criteria listed for this university.</p>
        )}
      </div>
    </div>
  );
};

export default UniversityEligibility;
