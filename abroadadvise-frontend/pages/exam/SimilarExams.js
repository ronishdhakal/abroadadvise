"use client";

import Link from "next/link";

const SimilarExams = ({ exams, currentSlug }) => {
  console.log("🔎 Received Similar Exams in Component:", exams); // ✅ Debug frontend data

  if (!Array.isArray(exams) || exams.length === 0) {
    console.log("❌ No Similar Exams Found");
    return null;
  }

  const otherExams = exams.filter((exam) => exam.slug !== currentSlug).slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar Exams</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {otherExams.map((exam) => (
          <div key={exam.slug} className="flex flex-col bg-gray-100 rounded-lg p-4 shadow">
            <div className="flex items-center gap-3">
              {exam.icon ? (
                <img
                src={exam.icon}
                alt={exam.name}
                className="h-12 w-12 object-cover rounded-md"
              />
              
              ) : (
                <div className="h-12 w-12 bg-gray-300 rounded-md"></div>
              )}

              <div>
                <Link href={`/exam/${exam.slug}`} className="text-sm font-medium text-gray-800 hover:text-blue-600">
                  {exam.name}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarExams;
