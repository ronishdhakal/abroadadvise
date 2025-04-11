"use client";

import { useState, useEffect } from "react";
import ConsultancySidebar from "../ConsultancySidebar"; // Import Sidebar
import ConsultancyInquiries from "./ConsultancyInquiries";
import { fetchConsultancyDashboard } from "@/utils/api";
import { Mail } from "lucide-react";

const InquiriesPage = () => {
  const [consultancy, setConsultancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching consultancy data...");
        const consultancyData = await fetchConsultancyDashboard();
        setConsultancy(consultancyData);
      } catch (error) {
        console.error("❌ Error fetching consultancy data:", error);
        setError("Failed to load consultancy data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 mx-auto mb-3 text-[#4c9bd5]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
          </svg>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-center py-6 text-red-600 bg-red-50 p-6 rounded-lg shadow-md max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ConsultancySidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultancy Inquiries</h1>
          {consultancy?.verified ? (
            <ConsultancyInquiries />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700 mb-2">Upgrade Your Plan</p>
              <p className="text-sm text-gray-500 mb-4">
                Please upgrade your plan to collect and view inquiries.
              </p>
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2.5 bg-[#4c9bd5] text-white rounded-lg hover:bg-[#3d8bc5] focus:ring-2 focus:ring-[#4c9bd5]/30 focus:outline-none transition-all duration-300 text-sm font-medium shadow-sm"
              >
                Learn More
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;