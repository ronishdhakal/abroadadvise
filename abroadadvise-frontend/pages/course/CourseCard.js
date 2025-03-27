"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

const CourseCard = ({ course }) => {
  if (!course) return null;

  // ✅ Normalize university object safely
  const university = course.university_details || course.university || null;
  const courseSlug = course.slug || "";
  const courseName = course.name || "Untitled Course";
  const coverImage = course.cover_image || null;

  return (
    <Link href={`/course/${courseSlug}`} passHref>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 p-5 cursor-pointer">
        {/* 📸 Course Image */}
        <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={courseName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400">No Image Available</span>
          )}
        </div>

        {/* 🧾 Course Title */}
        <h2 className="mt-4 text-xl font-semibold text-center text-gray-900">
          {courseName}
        </h2>

        {/* 🎓 University */}
        <p className="text-gray-600 text-center mt-2 flex items-center justify-center text-sm">
          <GraduationCap className="h-4 w-4 text-gray-400 mr-1" />
          {university?.name || "No University"}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
