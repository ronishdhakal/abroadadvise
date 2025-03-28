"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api";

const ConsultancyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const consultancyId = localStorage.getItem("consultancy_id");

        if (!token) {
          setError("User not logged in");
          return;
        }

        if (!consultancyId) {
          setError("Consultancy ID is missing. Please log in again.");
          return;
        }

        console.log("✅ Fetching inquiries for consultancy_id:", consultancyId, "Page:", currentPage);

        const response = await fetch(
          `${API_BASE_URL}/inquiry/admin/all/?consultancy_id=${consultancyId}&page=${currentPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch inquiries");
        } else {
          const data = await response.json();
          console.log("✅ Inquiry Data Received:", data);

          setInquiries(data.results || []);
          setTotalPages(Math.ceil(data.count / 10));
        }
      } catch (error) {
        setError(error.message || "Error fetching inquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Inquiries</h2>
        <p className="text-sm text-gray-500 mt-1">View and Manage Consultancy Inquiries</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center text-sm shadow-sm">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0a10 10 0 100 20 10 10 0 000-20zm1 14H9v2h2v-2zm0-10H9v8h2V4z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="animate-spin h-6 w-6 mx-auto mb-2 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
            Loading inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No inquiries yet. Once your consultancy is active, inquiries will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-blue-50 text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Name</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Email</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Contact Number</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Phone</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Message</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Consultancy</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">University</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Destination</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Exam</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Event</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Course</th>
                  <th className="p-3 font-medium text-left uppercase text-xs tracking-wide">Created At</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="p-3 text-gray-800">{inquiry.name}</td>
                    <td className="p-3 text-gray-800">{inquiry.email}</td>
                    <td className="p-3 text-gray-800">{inquiry.phone || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.phone || "-"}</td>
                    <td
                      className="p-3 text-gray-800 max-w-[200px] truncate"
                      title={inquiry.message}
                    >
                      {inquiry.message || "-"}
                    </td>
                    <td className="p-3 text-gray-800">{inquiry.consultancy_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.university_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.destination_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.exam_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.event_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.course_name || "-"}</td>
                    <td className="p-3 text-gray-800">
                      {new Date(inquiry.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultancyInquiries;
