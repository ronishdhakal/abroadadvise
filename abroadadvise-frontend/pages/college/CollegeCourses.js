"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Clock, School } from "lucide-react";
import InquiryModal from "@/components/InquiryModal";

const CollegeCourses = ({ college, courses = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const affiliatedUniversities = college?.affiliated_universities || [];

  // Filter courses based on affiliated universities
  const filteredCourses = courses.filter((course) => {
    const university = course.university_details || course.university || null;
    return affiliatedUniversities.some((affUni) => affUni.id === university?.id);
  });

  const visibleCourses = showAll ? filteredCourses : filteredCourses.slice(0, 5);

  const openInquiryModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl mx-auto mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Courses Offered by Affiliated Universities
      </h2>

      <div className="space-y-4">
        {visibleCourses.length > 0 ? (
          visibleCourses.map((course) => {
            const uni = course?.university_details || course?.university || null;

            return (
              <div
                key={course?.slug || course?.id}
                className="bg-gray-50 hover:bg-gray-100 transition rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <Link href={`/course/${course?.slug}`} className="block flex-grow w-full">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {course?.name || "Untitled Course"}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <School className="h-4 w-4 mr-1 text-gray-400" />
                      {uni?.name || "Unknown University"}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-8 text-gray-600 text-sm">
                  <div className="flex flex-col items-center">
                    <GraduationCap className="h-6 w-6 text-[#4c9bd5] mb-1" />
                    <span className="text-xs text-gray-500">Level</span>
                    <span className="text-sm font-medium">{course?.level || "N/A"}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Clock className="h-6 w-6 text-[#4c9bd5] mb-1" />
                    <span className="text-xs text-gray-500">Duration</span>
                    <span className="text-sm font-medium">{course?.duration || "N/A"}</span>
                  </div>
                </div>

                <button
                  onClick={() => openInquiryModal(course)}
                  className="px-5 py-2 bg-[#4c9bd5] text-white text-sm font-medium rounded-lg hover:bg-[#3b8ac2] transition"
                >
                  Apply
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            No courses found from affiliated universities.
          </p>
        )}
      </div>

      {/* Show More / Less */}
      {filteredCourses.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 text-sm font-medium text-[#4c9bd5] hover:underline flex items-center justify-center"
        >
          {showAll ? "Show Less" : `Show All (${filteredCourses.length})`}
        </button>
      )}

      {/* Inquiry Modal */}
      {selectedCourse && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType="course"
          entityId={selectedCourse?.id}
          entityName={selectedCourse?.name}
          collegeId={college?.id ?? null}
          collegeName={college?.name ?? ""}
        />
      )}
    </div>
  );
};

export default CollegeCourses;
