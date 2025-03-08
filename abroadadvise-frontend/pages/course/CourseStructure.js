"use client";

const CourseStructure = ({ structure }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-5 border max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Structure</h2>

      {structure ? (
        <div
          dangerouslySetInnerHTML={{ __html: structure }}
          className="text-gray-700 text-sm leading-relaxed prose prose-sm sm:prose-md"
        ></div>
      ) : (
        <p className="text-gray-500">Course structure details not available</p>
      )}
    </div>
  );
};

export default CourseStructure;
