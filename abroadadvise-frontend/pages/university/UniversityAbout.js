"use client";

import { useState, useEffect } from "react";

const UniversityAbout = ({ university = {} }) => {
  const [aboutContent, setAboutContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (university?.about?.trim()) {
      setAboutContent(university.about);
    }
  }, [university?.about]);

  const shouldClamp = !isExpanded && aboutContent.length > 300;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        About {university?.name || "this university"}
      </h2>

      {aboutContent ? (
        <div
          className={`prose prose-sm sm:prose md:prose-md max-w-none text-gray-800 ${
            shouldClamp ? "line-clamp-3 overflow-hidden" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: aboutContent }}
        />
      ) : (
        <p className="text-sm text-gray-500">No content available.</p>
      )}

      {aboutContent.length > 300 && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default UniversityAbout;
