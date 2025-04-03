"use client";

const CourseAbout = ({ about }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">About the Course</h2>

      {about ? (
        <div
          className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: about }}
        />
      ) : (
        <p className="text-gray-500">Course description not available</p>
      )}
    </div>
  );
};

export default CourseAbout;
