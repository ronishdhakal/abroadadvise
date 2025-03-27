"use client";

const ExamCenter = ({ exam }) => {
  if (!exam || !exam.exam_centers) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Exam Centers</h2>
      <div
        dangerouslySetInnerHTML={{ __html: exam.exam_centers }}
        className="text-gray-700"
      ></div>
    </div>
  );
};

export default ExamCenter;
