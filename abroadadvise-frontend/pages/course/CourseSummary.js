"use client";

import { Clock, DollarSign, GraduationCap, CalendarCheck, ListChecks } from "lucide-react";

const CourseSummary = ({ course }) => {
  if (!course) {
    return (
      <div className="w-full text-center text-gray-600 py-8 font-medium">
        Course information not available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
        
        {/* Duration */}
        <div className="group flex items-center gap-3 min-w-[140px] p-3 rounded-lg hover:bg-gray-100 transition-all duration-300">
          <div className="bg-gradient-to-br from-[#e6f3fc] to-[#d1e9f6] p-2 rounded-full shadow-sm">
            <Clock className="h-5 w-5 text-[#4c9bd5]" />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 font-light">Duration</p>
            <p className="font-medium text-gray-800 text-sm lg:text-base">
              {course.duration || "N/A"}
            </p>
          </div>
        </div>

        {/* Fee */}
        <div className="group flex items-center gap-3 min-w-[140px] p-3 rounded-lg hover:bg-gray-100 transition-all duration-300">
          <div className="bg-gradient-to-br from-[#e6f3fc] to-[#d1e9f6] p-2 rounded-full shadow-sm">
            <DollarSign className="h-5 w-5 text-[#4c9bd5]" />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 font-light">Fee</p>
            <p className="font-medium text-gray-800 text-sm lg:text-base">
              {course.fee || "Contact for Details"}
            </p>
          </div>
        </div>

        {/* Level */}
        <div className="group flex items-center gap-3 min-w-[140px] p-3 rounded-lg hover:bg-gray-100 transition-all duration-300">
          <div className="bg-gradient-to-br from-[#e6f3fc] to-[#d1e9f6] p-2 rounded-full shadow-sm">
            <GraduationCap className="h-5 w-5 text-[#4c9bd5]" />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 font-light">Level</p>
            <p className="font-medium text-gray-800 text-sm lg:text-base">
              {course.level || "N/A"}
            </p>
          </div>
        </div>

        {/* Next Intake */}
        <div className="group flex items-center gap-3 min-w-[140px] p-3 rounded-lg hover:bg-gray-100 transition-all duration-300">
          <div className="bg-gradient-to-br from-[#e6f3fc] to-[#d1e9f6] p-2 rounded-full shadow-sm">
            <CalendarCheck className="h-5 w-5 text-[#4c9bd5]" />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 font-light">Next Intake</p>
            <p className="font-medium text-gray-800 text-sm lg:text-base">
              {course.next_intake || "TBA"}
            </p>
          </div>
        </div>

        {/* Entry Score */}
        <div className="group flex items-center gap-3 min-w-[140px] p-3 rounded-lg hover:bg-gray-100 transition-all duration-300">
          <div className="bg-gradient-to-br from-[#e6f3fc] to-[#d1e9f6] p-2 rounded-full shadow-sm">
            <ListChecks className="h-5 w-5 text-[#4c9bd5]" />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 font-light">Entry Score</p>
            <p className="font-medium text-gray-800 text-sm lg:text-base">
              {course.entry_score || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSummary;