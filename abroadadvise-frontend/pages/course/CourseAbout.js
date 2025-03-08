"use client";

const CourseAbout = ({ about }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">About the Course</h2>

      {about ? (
        <div
          className="text-gray-700 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: about }} // ✅ Fix: Ensures proper HTML rendering
        />
      ) : (
        <p className="text-gray-500">Course description not available</p>
      )}
    </div>
  );
};

export default CourseAbout;
