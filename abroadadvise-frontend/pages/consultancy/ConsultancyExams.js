"use client";

import Link from "next/link";

const ConsultancyExams = ({ exams }) => {
  if (!exams || exams.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Test Preparation</h2>

      {/* Exam Tags with Links */}
      <div className="flex flex-wrap gap-2">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/exam/${exam.slug}`}  // ✅ Link to exam detail page
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
          >
            {exam.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ConsultancyExams;
