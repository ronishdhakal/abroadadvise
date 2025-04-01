"use client";

const CollegeServices = ({ college }) => {
  if (!college || !college.services) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Our Services</h2>
      <div
        dangerouslySetInnerHTML={{ __html: college.services }}
        className="text-gray-700"
      ></div>
    </div>
  );
};

export default CollegeServices;
