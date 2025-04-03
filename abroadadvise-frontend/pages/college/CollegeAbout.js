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
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800 mt-4"
        dangerouslySetInnerHTML={{
          __html: college.about || "<p>No additional details available.</p>",
        }}
      />
    </div>
  );
};

export default CollegeAbout;
