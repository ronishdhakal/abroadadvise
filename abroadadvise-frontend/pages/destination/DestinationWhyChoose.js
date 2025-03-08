"use client";

const DestinationWhyChoose = ({ destination }) => {
  if (!destination?.why_choose || destination.why_choose.trim() === "") {
    return null; // ✅ Hide section if empty
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Choose {destination.title}?</h2>

      <div
        className="prose prose-blue text-gray-800"
        dangerouslySetInnerHTML={{ __html: destination.why_choose }} // ✅ Render HTML safely
      />
    </div>
  );
};

export default DestinationWhyChoose;
