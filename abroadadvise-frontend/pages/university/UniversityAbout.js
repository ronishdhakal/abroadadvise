"use client";

import { useState, useEffect } from "react";

const UniversityAbout = ({ university = {} }) => {
  const [aboutContent, setAboutContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (university?.about) {
      setAboutContent(university.about);
    }
  }, [university?.about]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        About {university?.name || "this university"}
      </h2>

      {/* ✅ Safely render About content */}
      {aboutContent ? (
        <div
          className={`text-sm text-gray-700 ${isExpanded ? "" : "line-clamp-3"}`}
          dangerouslySetInnerHTML={{ __html: aboutContent }}
        ></div>
      ) : (
        <p className="text-sm text-gray-500">No content available.</p>
      )}

      {/* ✅ Toggle if long content */}
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
