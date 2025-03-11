"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchCourses } from "@/utils/api";

const UniversityCourses = ({ formData, setFormData, allCourses = [] }) => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // ✅ Prevents multiple fetches

  useEffect(() => {
    let isMounted = true; // ✅ Prevent memory leaks

    if (allCourses.length > 0) {
      setCourses(allCourses);
    } else if (!hasFetched) { // ✅ Ensure fetch only runs once
      setLoading(true);
      fetchCourses()
        .then((data) => {
          if (isMounted) {
            setCourses(data.results || []);
            setHasFetched(true); // ✅ Stop further requests
          }
        })
        .catch((error) => console.error("❌ Error fetching courses:", error))
        .finally(() => setLoading(false));
    }

    return () => {
      isMounted = false; // ✅ Cleanup function
    };
  }, [allCourses]); // ✅ Only run when allCourses changes

  // ✅ Handle Course Selection
  const handleCourseChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      courses: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Courses Offered</h2>

      {/* Multi-Select Dropdown for Courses */}
      <Select
        isMulti
        isLoading={loading}
        options={courses.map((course) => ({
          value: course.id,
          label: course.name,
        }))}
        value={formData.courses
          ?.map((id) => {
            const course = courses.find((c) => c.id === id);
            return course ? { value: course.id, label: course.name } : null;
          })
          .filter(Boolean)} // ✅ Prevents null values
        onChange={handleCourseChange}
        className="w-full"
        placeholder="Select courses offered by the university..."
      />

      {/* Display Selected Courses as Tags */}
      {formData.courses?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.courses.map((id) => {
            const course = courses.find((c) => c.id === id);
            return (
              course && (
                <span key={course.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                  {course.name}
                </span>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UniversityCourses;
