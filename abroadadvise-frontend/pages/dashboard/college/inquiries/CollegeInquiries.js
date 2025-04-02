"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api";
import { X } from "lucide-react";

const CollegeInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const collegeId = localStorage.getItem("college_id");

        if (!token) return setError("User not logged in");
        if (!collegeId) return setError("College ID is missing. Please log in again.");

        const response = await fetch(
          `${API_BASE_URL}/inquiry/admin/all/?college_id=${collegeId}&page=${currentPage}`,
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

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedInquiry(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Inquiries</h2>
        <p className="text-sm text-gray-500 mt-1">View and Manage College Inquiries</p>
      </div>

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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="animate-spin h-6 w-6 mx-auto mb-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
            </svg>
            Loading inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No inquiries yet. Once your college is active, inquiries will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-blue-50 text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="p-3">SN</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-left">College</th>
                  <th className="p-3 text-left">University</th>
                  <th className="p-3 text-left">Destination</th>
                  <th className="p-3 text-left">Exam</th>
                  <th className="p-3 text-left">Event</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry, index) => (
                  <tr key={inquiry.id} className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200">
                    <td className="p-3 text-center text-gray-700">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="p-3 text-gray-800">{inquiry.name}</td>
                    <td className="p-3 text-gray-800">{inquiry.email}</td>
                    <td className="p-3 text-gray-800">{inquiry.phone || "-"}</td>
                    <td className="p-3 text-gray-800 max-w-[200px] truncate" title={inquiry.message}>
                      {inquiry.message || "-"}
                    </td>
                    <td className="p-3 text-gray-800">{inquiry.college_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.university_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.destination_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.exam_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.event_name || "-"}</td>
                    <td className="p-3 text-gray-800">{inquiry.course_name || "-"}</td>
                    <td className="p-3 text-gray-800">{new Date(inquiry.created_at).toLocaleString()}</td>
                    <td className="p-3 text-blue-600 font-medium cursor-pointer hover:underline">
                      <button onClick={() => openModal(inquiry)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Prev
          </button>
          <span className="text-gray-700 text-sm font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative bg-white max-w-2xl w-full rounded-xl shadow-2xl border border-gray-100 p-6 overflow-y-auto max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800">Inquiry Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                Received on {new Date(selectedInquiry.created_at).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div><span className="font-medium">Name:</span> {selectedInquiry.name}</div>
              <div><span className="font-medium">Email:</span> {selectedInquiry.email}</div>
              <div><span className="font-medium">Phone:</span> {selectedInquiry.phone || "-"}</div>
              <div><span className="font-medium">College:</span> {selectedInquiry.college_name || "-"}</div>
              <div><span className="font-medium">University:</span> {selectedInquiry.university_name || "-"}</div>
              <div><span className="font-medium">Destination:</span> {selectedInquiry.destination_name || "-"}</div>
              <div><span className="font-medium">Exam:</span> {selectedInquiry.exam_name || "-"}</div>
              <div><span className="font-medium">Event:</span> {selectedInquiry.event_name || "-"}</div>
              <div><span className="font-medium">Course:</span> {selectedInquiry.course_name || "-"}</div>
              <div><span className="font-medium">Entity Type:</span> {selectedInquiry.entity_type || "-"}</div>
              <div><span className="font-medium">Entity ID:</span> {selectedInquiry.entity_id || "-"}</div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-800 mb-1 block">Message</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line max-h-60 overflow-auto">
                {selectedInquiry.message || "-"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeInquiries;
