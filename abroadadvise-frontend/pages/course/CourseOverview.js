"use client";

import { Building, Calendar, GraduationCap, DollarSign } from "lucide-react";
import Link from "next/link";

const CourseOverview = ({ course }) => {
  if (!course) {
    return (
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <p className="text-gray-500 italic">Course data not available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Course Information</h2>

      {/* ✅ University */}
      <div className="flex items-center gap-3 text-gray-800 text-sm mb-4">
        <Building className="h-5 w-5 text-gray-500" />
        <div>
          <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">University</span>
          {course.university?.slug ? (
            <Link
              href={`/university/${course.university.slug}`}
              className="font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              {course.university?.name || "Unnamed University"}
            </Link>
          ) : (
            <span className="font-semibold text-gray-700">N/A</span>
          )}
        </div>
      </div>

      {/* ✅ Duration */}
      <div className="flex items-center gap-3 text-gray-800 text-sm mb-4">
        <Calendar className="h-5 w-5 text-gray-500" />
        <div>
          <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">Duration</span>
          <span className="font-semibold text-gray-800">
            {course.duration || "N/A"}
          </span>
        </div>
      </div>

      {/* ✅ Level */}
      <div className="flex items-center gap-3 text-gray-800 text-sm mb-4">
        <GraduationCap className="h-5 w-5 text-gray-500" />
        <div>
          <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">Level</span>
          <span className="font-semibold text-gray-800">
            {course.level || "N/A"}
          </span>
        </div>
      </div>

      {/* ✅ Fee */}
      <div className="flex items-center gap-3 text-gray-800 text-sm">
        <DollarSign className="h-5 w-5 text-gray-500" />
        <div>
          <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">Fee</span>
          <span className="font-semibold text-gray-800">
            {course.fee || "Contact for Pricing"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
