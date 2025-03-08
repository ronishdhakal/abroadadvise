"use client";

import { useEffect, useState } from "react";

const DestinationOverview = ({ destination, universities, consultancies }) => {
  const [universityCount, setUniversityCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [consultancyCount, setConsultancyCount] = useState(0);

  useEffect(() => {
    if (!destination) return;

    console.log("🟢 Universities Data:", universities);
    console.log("🟢 Consultancies Data:", consultancies);

    // ✅ Count Universities where country matches destination title
    const matchedUniversities = universities.filter(
      (university) => university.country === destination.title
    );
    setUniversityCount(matchedUniversities.length);

    // ✅ Count Consultancies assigned to this destination
    const matchedConsultancies = consultancies.filter(
      (consultancy) =>
        Array.isArray(consultancy.study_abroad_destinations) &&
        consultancy.study_abroad_destinations.some((dest) => dest.id === destination.id)
    );
    setConsultancyCount(matchedConsultancies.length);

    // ✅ Fetch courses dynamically
    const fetchCourses = async () => {
      try {
        console.log("Fetching courses for:", destination.title);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/course/?destination=${destination.slug}`
        );

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();
        console.log("Fetched Courses:", data.results);
        setCourseCount(Array.isArray(data.results) ? data.results.length : 0);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [destination, universities, consultancies]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-white mt-6">
      <div className="grid grid-cols-3 gap-4 text-center border-b pb-6">
        {/* ✅ Universities Count */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-blue-600">{universityCount}+</h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">Universities</p>
        </div>

        {/* ✅ Courses Count */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-blue-600">{courseCount}+</h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">Courses</p>
        </div>

        {/* ✅ Consultancies Count */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-blue-600">{consultancyCount}+</h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">Consultancies</p>
        </div>
      </div>
    </section>
  );
};

export default DestinationOverview;
