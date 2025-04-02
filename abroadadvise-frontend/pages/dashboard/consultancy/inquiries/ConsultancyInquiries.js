"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api";
import { X } from "lucide-react";

const ConsultancyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const consultancyId = localStorage.getItem("consultancy_id");

        if (!token) return setError("User not logged in");
        if (!consultancyId) return setError("Consultancy ID is missing. Please log in again.");

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

  const openDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setSelectedInquiry(null);
    setShowDetails(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Inquiries</h2>
        <p className="text-sm text-gray-500 mt-1">View and Manage Consultancy Inquiries</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center text-sm shadow-sm">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zm1 14H9v2h2v-2zm0-10H9v8h2V4z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No inquiries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-blue-50 text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center text-xs uppercase tracking-wide">SN</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Name</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Email</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Phone</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Message</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">University</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Destination</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Exam</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Event</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Course</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Created At</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry, index) => (
                  <tr key={inquiry.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 text-center">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="p-3">{inquiry.name}</td>
                    <td className="p-3">{inquiry.email}</td>
                    <td className="p-3">{inquiry.phone || "-"}</td>
                    <td className="p-3 truncate max-w-[200px]" title={inquiry.message}>{inquiry.message || "-"}</td>
                    <td className="p-3">{inquiry.university_name || "-"}</td>
                    <td className="p-3">{inquiry.destination_name || "-"}</td>
                    <td className="p-3">{inquiry.exam_name || "-"}</td>
                    <td className="p-3">{inquiry.event_name || "-"}</td>
                    <td className="p-3">{inquiry.course_name || "-"}</td>
                    <td className="p-3">{new Date(inquiry.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => openDetails(inquiry)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View
                      </button>
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
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Modal */}
      {showDetails && selectedInquiry && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        >
          <div className="relative bg-white rounded-xl max-w-2xl w-full shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Inquiry Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div><strong>Name:</strong> {selectedInquiry.name}</div>
              <div><strong>Email:</strong> {selectedInquiry.email}</div>
              <div><strong>Phone:</strong> {selectedInquiry.phone || "-"}</div>
              <div><strong>University:</strong> {selectedInquiry.university_name || "-"}</div>
              <div><strong>Destination:</strong> {selectedInquiry.destination_name || "-"}</div>
              <div><strong>Exam:</strong> {selectedInquiry.exam_name || "-"}</div>
              <div><strong>Event:</strong> {selectedInquiry.event_name || "-"}</div>
              <div><strong>Course:</strong> {selectedInquiry.course_name || "-"}</div>
              <div><strong>Submitted At:</strong> {new Date(selectedInquiry.created_at).toLocaleString()}</div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-line max-h-60 overflow-auto">
                {selectedInquiry.message || "-"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultancyInquiries;
