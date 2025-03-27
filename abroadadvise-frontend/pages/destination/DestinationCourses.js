"use client";

import { useEffect, useState } from "react";
import InquiryModal from "@/components/InquiryModal"; // ✅ Import Inquiry Modal

const DestinationCourses = ({ destination }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const coursesPerPage = 6;

  useEffect(() => {
    if (!destination?.slug) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log("Fetching courses for:", destination.title);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/course/?destination=${destination.slug}`
        );

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();
        console.log("Fetched Courses:", data.results);
        setCourses(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [destination]);

  const displayedCourses = showAll ? courses : courses.slice(0, coursesPerPage);

  const handleApplyNow = (course) => {
    setSelectedCourse({
      courseId: course.id,
      courseName: course.name,
      destinationId: destination?.id || null,
      destinationName: destination?.title || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Popular Courses to Study in {destination?.title || "this Destination"}
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading courses...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : displayedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded-lg shadow-sm p-4 flex items-center justify-between"
            >
              {/* ✅ Link course details to course detail page */}
              <a
                href={`/course/${course.slug}`}
                className="flex items-center gap-4 flex-grow cursor-pointer"
              >
                {course.icon ? (
                  <img
                    src={course.icon}
                    alt={course.name}
                    className="h-10 w-10 object-cover rounded-md bg-gray-100"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-300 rounded-md" />
                )}

                <div>
                  <p className="text-md font-medium text-gray-900">{course.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.level === "Undergraduate"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {course.level || "N/A"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.duration || "Duration N/A"}
                    </span>
                  </div>
                </div>
              </a>

              {/* ✅ Apply Now Button */}
              <button
                onClick={() => handleApplyNow(course)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition-all"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No courses available in {destination?.title || "this destination"}.
        </p>
      )}

      {/* ✅ Show All Toggle */}
      {courses.length > coursesPerPage && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 text-sm font-medium hover:underline flex items-center"
          >
            {showAll ? "Show Less" : `Show All Courses (${courses.length})`}
            <span className={`ml-1 transform ${showAll ? "rotate-180" : "rotate-0"}`}>▼</span>
          </button>
        </div>
      )}

      {/* ✅ Inquiry Modal */}
      {selectedCourse && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType="course"
          entityId={selectedCourse.courseId}
          entityName={selectedCourse.courseName}
          additionalData={{
            destinationId: selectedCourse.destinationId,
            destinationName: selectedCourse.destinationName,
          }}
        />
      )}
    </div>
  );
};

export default DestinationCourses;
