"use client";

const CourseFeatures = ({ features }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-5 border max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Features</h2>

      {features ? (
        <div
          dangerouslySetInnerHTML={{ __html: features }}
          className="text-gray-700 text-sm leading-relaxed prose prose-sm sm:prose-md"
        ></div>
      ) : (
        <p className="text-gray-500">No key features available</p>
      )}
    </div>
  );
};

export default CourseFeatures;
