"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const ConsultancyExams = ({ exams = [], openInquiryModal, consultancyId, consultancyName, verified }) => {
  const [showAll, setShowAll] = useState(false);

  if (!exams || exams.length === 0) return null;

  const visibleExams = showAll ? exams : exams.slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Title stays the same */}
      <h2 className="text-xl font-semibold mb-4">Test Preparation</h2>

      {/* Updated Card Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleExams.map((exam) => (
          <div
            key={exam.id}
            className="flex flex-col items-start p-5 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <Link href={`/exam/${exam.slug || "#"}`} className="flex items-center gap-4 w-full">
              <img
                src={exam.icon || "/placeholder-icon.png"}
                alt={exam.name || "Exam"}
                className="w-10 h-10 object-cover rounded-full border border-gray-300"
              />
              <span className="text-gray-800 font-medium text-base">{exam.name || "Unnamed Exam"}</span>
            </Link>

            {verified && (
              <button
                onClick={() =>
                  openInquiryModal("exam", exam.id, exam.name, consultancyId, consultancyName)
                }
                className="mt-4 w-full px-4 py-2 bg-[#4c9bd5] hover:bg-[#3b8ac2] text-white text-sm font-medium rounded-md transition duration-200"
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {exams.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 flex items-center justify-center text-[#4c9bd5] hover:underline font-medium"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-5 w-5 mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5 mr-1" /> Show All ({exams.length})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ConsultancyExams;
