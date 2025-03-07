const UniversityFacilities = ({ university }) => {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl mx-auto mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">University Facilities</h2>
  
        {/* Facilities and Features Section */}
        <div className="text-sm text-gray-700">
          {university.facilities_features ? (
            <div
              dangerouslySetInnerHTML={{ __html: university.facilities_features }}
              className="prose prose-sm sm:prose-md"
            ></div>
          ) : (
            <p className="text-gray-500">No facilities or features listed for this university.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default UniversityFacilities;
  