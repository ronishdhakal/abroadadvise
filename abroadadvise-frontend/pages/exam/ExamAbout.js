"use client";

const ExamAbout = ({ exam }) => {
  return (
    exam.about && (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About {exam.name}</h2>
        <div dangerouslySetInnerHTML={{ __html: exam.about }} className="text-gray-700"></div>
      </div>
    )
  );
};

export default ExamAbout;
