"use client";

const CollegeAbout = ({ college }) => {
  if (!college) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900">About</h2>
        <p className="text-gray-600 mt-2">No college data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        {`About ${college.name || "this College"}`}
      </h2>
      <div
        className="text-gray-800 leading-relaxed mt-2 font-normal"
        dangerouslySetInnerHTML={{
          __html: college.about || "No additional details available.",
        }}
      />
    </div>
  );
};

export default CollegeAbout;
