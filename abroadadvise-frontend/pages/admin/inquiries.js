"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { getAllInquiries } from "@/utils/api";

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadInquiries = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInquiries(page);
      console.log("✅ Fetched Inquiries Data:", data);
      setInquiries(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
      setCurrentPage(page);
    } catch (err) {
      console.error("❌ Failed to load inquiries:", err);
      setError("Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries(currentPage);
  }, [currentPage]);

  return (
    <AdminLayout>
      <Head>
        <title>Manage Inquiries | Admin Panel</title>
      </Head>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Empowering Students Across Disciplines</p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm transition-all duration-300"
          />
          <button
            onClick={() => loadInquiries(1)}
            className="bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 text-sm font-medium shadow-sm"
          >
            Refresh
          </button>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-blue-50 text-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Name</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Email</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Contact Number</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Phone</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Message</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Entity Type</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Entity ID</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Consultancy</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">University</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Destination</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Exam</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Event</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Course</th>
                    <th className="p-4 font-medium text-left uppercase text-xs tracking-wide">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length > 0 ? (
                    inquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="p-4 text-gray-800">{inquiry.name}</td>
                        <td className="p-4 text-gray-800">{inquiry.email}</td>
                        <td className="p-4 text-gray-800">{inquiry.phone || "-"}</td>
                        <td className="p-4 text-gray-800">{inquiry.phone || "-"}</td>
                        <td
                          className="p-4 text-gray-800 max-w-[200px] truncate"
                          title={inquiry.message}
                        >
                          {inquiry.message || "-"}
                        </td>
                        <td className="p-4 text-gray-800">{inquiry.entity_type}</td>
                        <td className="p-4 text-gray-800">{inquiry.entity_id}</td>
                        <td className="p-4 text-gray-800">{inquiry.consultancy_name || "-"}</td>
                        <td className="p-4 text-gray-800">{inquiry.university_name || "-"}</td>
                        <td className="p-4 text-gray-800">{inquiry.destination_name || "-"}</td>
                        <td className="p-4 text-gray-800">{inquiry.exam_name || "-"}</td>
                        <td className="p-4 text-gray-800">{inquiry.event_name || "-"}</td>
                        <td className="p-4 text-gray-800">{inquiry.course_name || "-"}</td>
                        <td className="p-4 text-gray-800">
                          {new Date(inquiry.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="14" className="text-center p-8 text-gray-500">
                        No inquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => loadInquiries(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
            >
              Prev
            </button>
            <span className="text-gray-700 font-medium text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => loadInquiries(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InquiriesPage;