"use client";

import UniversitySidebar from "../UniversitySidebar"; // ✅ Sidebar for navigation
import UniversityInquiries from "./UniversityInquiries.js";

const UniversityInquiriesPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Sidebar for Dashboard Navigation */}
      <UniversitySidebar />

      {/* ✅ Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 border-b pb-3">University Inquiries</h1>
          <UniversityInquiries />
        </div>
      </div>
    </div>
  );
};

export default UniversityInquiriesPage;
