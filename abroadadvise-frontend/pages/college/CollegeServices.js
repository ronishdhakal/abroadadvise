"use client";

const CollegeServices = ({ college }) => {
  if (!college || !college.services) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Our Services</h2>
      <div
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: college.services }}
      />
    </div>
  );
};

export default CollegeServices;
