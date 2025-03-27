"use client";

const ExamAbout = ({ exam }) => {
  if (!exam || !exam.name) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">About {exam.name}</h2>
      {exam.about ? (
        <div
          dangerouslySetInnerHTML={{ __html: exam.about }}
          className="text-gray-700"
        ></div>
      ) : (
        <p className="text-gray-500">No information available for this exam.</p>
      )}
    </div>
  );
};

export default ExamAbout;
