const UniversityFAQs = ({ university }) => {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl mx-auto mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
  
        {/* FAQ Section */}
        <div className="text-sm text-gray-700">
          {university.faqs ? (
            <div
              dangerouslySetInnerHTML={{ __html: university.faqs }}
              className="prose prose-sm sm:prose-md"
            ></div>
          ) : (
            <p className="text-gray-500">No FAQs listed for this university.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default UniversityFAQs;
  