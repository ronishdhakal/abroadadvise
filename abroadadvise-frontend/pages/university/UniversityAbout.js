import { useState, useEffect } from "react";

const UniversityAbout = ({ university }) => {
  const [aboutContent, setAboutContent] = useState("");

  useEffect(() => {
    if (university.about) {
      setAboutContent(university.about);
    }
  }, [university.about]);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">About {university.name}</h2>

      {/* Prevent Hydration Error by Checking Content */}
      {aboutContent ? (
        <p
          className={`text-sm text-gray-700 ${isExpanded ? "" : "line-clamp-3"}`}
          dangerouslySetInnerHTML={{ __html: aboutContent }}
        ></p>
      ) : (
        <p className="text-sm text-gray-500">No content available.</p>
      )}

      {/* Show More / Show Less Button */}
      {aboutContent.length > 300 && (
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
