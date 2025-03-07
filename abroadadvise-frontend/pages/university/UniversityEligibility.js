const UniversityEligibility = ({ university }) => {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl mx-auto mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h2>
  
        {/* Eligibility Section */}
        <div className="text-sm text-gray-700">
          {university.eligibility ? (
            <div
              dangerouslySetInnerHTML={{ __html: university.eligibility }}
              className="prose prose-sm sm:prose-md"
            ></div>
          ) : (
            <p className="text-gray-500">No eligibility criteria listed for this university.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default UniversityEligibility;
  