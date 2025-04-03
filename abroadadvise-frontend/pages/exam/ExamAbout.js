"use client";

const ExamAbout = ({ exam }) => {
  if (!exam || !exam.name) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">About {exam.name}</h2>

      {exam.about ? (
        <div
          className="prose prose-sm sm:prose md:prose-md max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: exam.about }}
        />
      ) : (
        <p className="text-gray-500">No information available for this exam.</p>
      )}
    </div>
  );
};

export default ExamAbout;
