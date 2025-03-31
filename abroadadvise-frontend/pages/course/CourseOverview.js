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

      {/* University */}
      <div className="flex items-start gap-3 mb-4">
        <Building className="h-5 w-5 text-[#4c9bd5] mt-1" />
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">
            University
          </p>
          {course.university?.slug ? (
            <Link
              href={`/university/${course.university.slug}`}
              className="text-sm font-semibold text-[#4c9bd5] hover:underline"
            >
              {course.university?.name || "Unnamed University"}
            </Link>
          ) : (
            <span className="text-sm font-semibold text-gray-700">N/A</span>
          )}
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-start gap-3 mb-4">
        <Calendar className="h-5 w-5 text-[#4c9bd5] mt-1" />
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">
            Duration
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {course.duration || "N/A"}
          </p>
        </div>
      </div>

      {/* Level */}
      <div className="flex items-start gap-3 mb-4">
        <GraduationCap className="h-5 w-5 text-[#4c9bd5] mt-1" />
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">
            Level
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {course.level || "N/A"}
          </p>
        </div>
      </div>

      {/* Fee */}
      <div className="flex items-start gap-3">
        <DollarSign className="h-5 w-5 text-[#4c9bd5] mt-1" />
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">
            Fee
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {course.fee || "Contact for Pricing"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
