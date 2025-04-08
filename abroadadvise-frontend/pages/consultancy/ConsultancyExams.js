"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ConsultancyExams = ({
  exams = [],
  openInquiryModal,
  consultancyId,
  consultancyName,
  verified,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!Array.isArray(exams) || exams.length === 0) return null;

  const visibleExams = showAll ? exams : exams.slice(0, 6);

  return (
    <section
      className="bg-white p-6 rounded-lg shadow-md"
      aria-labelledby="consultancy-exams-heading"
    >
      <h2
        id="consultancy-exams-heading"
        className="text-xl font-semibold mb-4 text-gray-800"
      >
        Test Preparation
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleExams.map((exam) => (
          <div
            key={exam.id}
            className="flex flex-col items-start p-5 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <Link
              href={`/exam/${exam.slug || "#"}`}
              className="flex items-center gap-4 w-full"
              aria-label={`View details about ${exam.name || "Exam"}`}
            >
              <img
                src={exam.icon || "/placeholder-icon.png"}
                alt={exam.name ? `${exam.name} icon` : "Exam icon"}
                className="w-10 h-10 object-cover rounded-full border border-gray-300"
                loading="lazy"
              />
              <span className="text-gray-800 font-medium text-base">
                {exam.name || "Unnamed Exam"}
              </span>
            </Link>

            {verified && (
              <button
                onClick={() =>
                  openInquiryModal(
                    "exam",
                    exam.id,
                    exam.name,
                    consultancyId,
                    consultancyName
                  )
                }
                className="mt-4 w-full px-4 py-2 bg-[#4c9bd5] hover:bg-[#3b8ac2] text-white text-sm font-medium rounded-md transition duration-200"
                aria-label={`Apply for ${exam.name}`}
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {exams.length > 6 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center px-5 py-2 bg-[#4c9bd5] text-white text-sm font-medium rounded-full hover:bg-[#3a8cc1] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            aria-label={showAll ? "Show fewer exams" : "Show all exams"}
          >
            {showAll ? (
              <>
                <ChevronUpIcon className="h-5 w-5 mr-2 transform group-hover:-translate-y-0.5 transition-transform duration-300" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-5 w-5 mr-2 transform group-hover:translate-y-0.5 transition-transform duration-300" />
                Show All ({exams.length})
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default ConsultancyExams;
