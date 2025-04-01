"use client";

import CollegeSidebar from "../CollegeSidebar"; // ✅ Make sure this exists
import CollegeInquiries from "./CollegeInquiries"; // ✅ Make sure this is a valid component

const CollegeInquiriesPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <CollegeSidebar />
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">College Inquiries</h1>
          <CollegeInquiries />
        </div>
      </div>
    </div>
  );
};

export default CollegeInquiriesPage;
