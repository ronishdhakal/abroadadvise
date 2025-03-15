"use client";

import ConsultancySidebar from "../ConsultancySidebar"; // Import Sidebar
import ConsultancyInquiries from "./ConsultancyInquiries";

const InquiriesPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ConsultancySidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultancy Inquiries</h1>
          <ConsultancyInquiries />
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;
