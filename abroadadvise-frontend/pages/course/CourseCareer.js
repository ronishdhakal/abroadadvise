"use client";

const CourseCareer = ({ jobProspects }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-5 border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Career Opportunities</h2>

      {jobProspects ? (
        <div
          className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: jobProspects }}
        />
      ) : (
        <p className="text-gray-500">Career information not available</p>
      )}
    </div>
  );
};

export default CourseCareer;
