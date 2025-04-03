"use client";

const ExamCenter = ({ exam }) => {
  if (!exam || !exam.exam_centers) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Exam Centers</h2>
      <div
        className="prose prose-sm sm:prose md:prose-md max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: exam.exam_centers }}
      />
    </div>
  );
};

export default ExamCenter;
