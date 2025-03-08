"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Clock, School } from "lucide-react";
import InquiryModal from "@/components/InquiryModal"; // Import Inquiry Modal component

const UniversityCourses = ({ courses }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCourses = showAll ? courses : courses.slice(0, 5); // Show only 5 initially

  // State for Inquiry Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Function to open the modal and pass the course details
  const openInquiryModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl mx-auto mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Courses Offered by {courses[0]?.university?.name}
      </h2>

      {/* Courses List */}
      <div className="space-y-4">
        {visibleCourses.length > 0 ? (
          visibleCourses.map((course) => (
            <div key={course.slug} className="bg-white hover:bg-gray-50 transition rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer border border-gray-200">
              <Link href={`/course/${course.slug}`} className="block flex-grow">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <School className="h-4 w-4 mr-1 text-gray-400" />
                    {course.university?.name || "Unknown University"}
                  </p>
                </div>
              </Link>

              {/* Course Details (Level & Duration) */}
              <div className="flex items-center gap-8 text-gray-600 text-sm">
                {/* Level */}
                <div className="flex flex-col items-center">
                  <GraduationCap className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Level</span>
                  <span className="text-sm font-medium">{course.level || "Not Specified"}</span>
                </div>

                {/* Duration */}
                <div className="flex flex-col items-center">
                  <Clock className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Duration</span>
                  <span className="text-sm font-medium">{course.duration || "Not Specified"}</span>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => openInquiryModal(course)}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No courses available.</p>
        )}
      </div>

      {/* Show More / Show Less Button */}
      {courses.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 text-sm font-medium text-blue-600 hover:underline flex items-center justify-center"
        >
          {showAll ? "Show Less" : `Show All (${courses.length})`}
        </button>
      )}

      {/* Inquiry Modal */}
      {selectedCourse && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType="course"
          entityId={selectedCourse.id}
          entityName={selectedCourse.name}
          universityId={selectedCourse.university?.id || null}
          universityName={selectedCourse.university?.name || ""}
        />
      )}
    </div>
  );
};

export default UniversityCourses;
