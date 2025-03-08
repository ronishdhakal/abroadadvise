"use client";

const UniversityEligibility = ({ university }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-5 border max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Eligibility Criteria</h2>

      {/* Eligibility Content */}
      <div className="text-sm text-gray-700">
        {university.eligibility ? (
          <div
            dangerouslySetInnerHTML={{ __html: university.eligibility }}
            className="prose prose-sm sm:prose-md text-gray-700"
          ></div>
        ) : (
          <p className="text-gray-500">No eligibility criteria listed for this university.</p>
        )}
      </div>
    </div>
  );
};

export default UniversityEligibility;
