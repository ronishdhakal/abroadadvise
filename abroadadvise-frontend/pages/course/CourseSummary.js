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
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-b border-gray-200 bg-white">
      {/* Duration */}
      <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700 min-w-[150px] justify-center">
        <div className="bg-[#e6f3fc] p-2 rounded-full">
          <Clock className="h-5 w-5 text-[#4c9bd5]" />
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-500">Duration</p>
          <p className="font-semibold text-gray-800">
            {course.duration || "N/A"}
          </p>
        </div>
      </div>

      {/* Fee */}
      <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700 min-w-[150px] justify-center">
        <div className="bg-[#e6f3fc] p-2 rounded-full">
          <DollarSign className="h-5 w-5 text-[#4c9bd5]" />
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-500">Fee</p>
          <p className="font-semibold text-gray-800">
            {course.fee || "Contact for Details"}
          </p>
        </div>
      </div>

      {/* Level */}
      <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700 min-w-[150px] justify-center">
        <div className="bg-[#e6f3fc] p-2 rounded-full">
          <GraduationCap className="h-5 w-5 text-[#4c9bd5]" />
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-500">Level</p>
          <p className="font-semibold text-gray-800">
            {course.level || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseSummary;
