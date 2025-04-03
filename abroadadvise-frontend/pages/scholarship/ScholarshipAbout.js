"use client";

const ScholarshipAbout = ({ scholarship }) => {
  if (!scholarship) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
      {/* Scholarship Detail / Description */}
      <div
        className="prose prose-lg prose-blue max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: scholarship.detail }}
      />
    </div>
  );
};

export default ScholarshipAbout;
