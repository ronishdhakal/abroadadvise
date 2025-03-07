import { useState } from "react";

const UniversityAbout = ({ university }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">About {university.name}</h2>

      {/* University About Section */}
      <p
        className={`text-sm text-gray-700 ${isExpanded ? "" : "line-clamp-3"}`}
        dangerouslySetInnerHTML={{ __html: university.about }}
      ></p>

      {/* Show More / Show Less Button */}
      {university.about && university.about.length > 300 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default UniversityAbout;
