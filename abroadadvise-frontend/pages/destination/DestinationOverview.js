"use client";

import { useEffect, useState } from "react";
import { BookOpen, Award } from "lucide-react";

const DestinationOverview = ({ destination = {}, universities = [], consultancies = [] }) => {
  const [universityCount, setUniversityCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [consultancyCount, setConsultancyCount] = useState(0);

  useEffect(() => {
    if (!destination?.id || !destination?.title || !destination?.slug) return;

    console.log("🟢 Universities Data:", universities);
    console.log("🟢 Consultancies Data:", consultancies);

    // ✅ Count matching universities
    const matchedUniversities = universities.filter(
      (university) => university.country === destination.title
    );
    setUniversityCount(matchedUniversities.length);

    // ✅ Count consultancies with this destination
    const matchedConsultancies = consultancies.filter(
      (consultancy) =>
        Array.isArray(consultancy.study_abroad_destinations) &&
        consultancy.study_abroad_destinations.some((dest) => dest.id === destination.id)
    );
    setConsultancyCount(matchedConsultancies.length);

    // ✅ Fetch course count
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gradient-to-b from-white to-gray-50 mt-6 shadow-sm rounded-lg">
      {/* University, Courses, Consultancies Stats */}
      <div className="grid grid-cols-3 gap-4 text-center border-b border-gray-200 pb-6">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-[#4c9bd5]">{universityCount}+</h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">Universities</p>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-[#4c9bd5]">{courseCount}+</h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">Courses</p>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-[#4c9bd5]">{consultancyCount}+</h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">Consultancies</p>
        </div>
      </div>

      {/* EPT & GPA Requirement Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {/* EPT Requirement */}
        <div className="group relative bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-br from-[#e6f3fc] to-[#c5e1f5] p-3 rounded-full shadow-sm">
            <BookOpen className="h-6 w-6 text-[#4c9bd5]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">
              EPT Requirement
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {destination?.ept_requirement || "Not Specified"}
            </p>
          </div>
          <div className="absolute inset-0 bg-[#e6f3fc] opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
        </div>

        {/* GPA Requirement */}
        <div className="group relative bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-br from-[#e6f3fc] to-[#c5e1f5] p-3 rounded-full shadow-sm">
            <Award className="h-6 w-6 text-[#4c9bd5]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">
              GPA Requirement
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {destination?.gpa_requirement || "Not Specified"}
            </p>
          </div>
          <div className="absolute inset-0 bg-[#e6f3fc] opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
        </div>
      </div>
    </section>
  );
};

export default DestinationOverview;
