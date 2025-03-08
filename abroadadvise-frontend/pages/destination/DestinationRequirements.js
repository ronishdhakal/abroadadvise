"use client";

const DestinationRequirements = ({ destination }) => {
  if (!destination?.requirements || destination.requirements.trim() === "") {
    return null; // ✅ Hide section if empty
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements for Studying in {destination.title}</h2>

      <div
        className="prose prose-blue text-gray-800"
        dangerouslySetInnerHTML={{ __html: destination.requirements }} // ✅ Render HTML safely
      />
    </div>
  );
};

export default DestinationRequirements;
