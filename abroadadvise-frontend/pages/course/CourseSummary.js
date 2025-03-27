"use client";

import { Clock, DollarSign, GraduationCap } from "lucide-react";

const CourseSummary = ({ course }) => {
  if (!course) {
    return (
      <div className="w-full text-center text-gray-500 py-6">
        Course information not available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] md:max-w-[1200px] lg:max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex flex-wrap items-center justify-center gap-4 md:gap-16 border-b">
      {/* ✅ Course Duration */}
      <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
        <Clock className="h-5 w-5 text-gray-500" />
        <div>
          <span className="block text-gray-500 text-xs sm:text-sm text-center">Duration</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            {course.duration || "N/A"}
          </span>
        </div>
      </div>

      {/* ✅ Course Fee */}
      <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
        <DollarSign className="h-5 w-5 text-gray-500" />
        <div>
          <span className="block text-gray-500 text-xs sm:text-sm text-center">Fee</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            {course.fee || "Contact for Details"}
          </span>
        </div>
      </div>

      {/* ✅ Course Level */}
      <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
        <GraduationCap className="h-5 w-5 text-gray-500" />
        <div>
          <span className="block text-gray-500 text-xs sm:text-sm text-center">Level</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            {course.level || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseSummary;
