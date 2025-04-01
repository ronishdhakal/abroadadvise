"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { API_BASE_URL } from "@/utils/api";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/course/`);
        const data = await res.json();
        if (data.results) {
          setCourses(data.results.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-0 mt-0 mb-0">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 text-[#4c9bd5] mr-2" /> Featured Courses
          </h2>
          <p className="text-gray-600">Popular programs to kickstart your career</p>
        </div>
        <Link href="/course">
          <button className="border border-gray-300 rounded-lg px-4 py-2 text-[#4c9bd5] flex items-center hover:bg-[#4c9bd5]/10 transition">
            View All →
          </button>
        </Link>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-md rounded-lg p-6 border flex flex-col justify-between hover:shadow-lg transition-all duration-300"
          >
            {/* Course Icon & Name */}
            <div className="flex items-center space-x-4">
              {/* Icon links to detail page */}
              <Link href={`/course/${course.slug}`} className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                {course.icon ? (
                  <Image
                    src={course.icon}
                    alt={course.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <BookOpen className="w-6 h-6 text-[#4c9bd5]" />
                )}
              </Link>

              {/* Course Name & Level */}
              <div className="flex-1">
                {/* Name links to detail page */}
                <Link href={`/course/${course.slug}`} className="hover:underline">
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                </Link>
                <span className="bg-[#4c9bd5] text-white text-xs font-semibold px-2 py-1 rounded-lg mt-1 inline-block">
                  {course.level || "Degree"}
                </span>
              </div>
            </div>

            {/* Course Duration */}
            <p className="text-gray-700 text-sm mt-3">
              <span className="font-medium">Duration:</span> {course.duration || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}