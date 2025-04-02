"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { API_BASE_URL } from "@/utils/api";

const UniversityInquiries = () => {
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

        const token = localStorage.getItem("access_token");
        const universityId = localStorage.getItem("university_id");

        if (!token) return setError("User not logged in");
        if (!universityId) return setError("University ID missing. Please log in again.");

        const response = await fetch(
          `${API_BASE_URL}/inquiry/admin/all/?university_id=${universityId}&page=${currentPage}`,
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
      <h2 className="text-2xl font-bold text-gray-900 mb-4">University Inquiries</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg shadow-sm text-sm">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto border">
        {loading ? (
          <p className="text-center py-6 text-gray-600">Loading inquiries...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No inquiries yet.</p>
        ) : (
          <table className="w-full min-w-[1000px] text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">SN</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Entity</th>
                <th className="p-3 border">Consultancy</th>
                <th className="p-3 border">University</th>
                <th className="p-3 border">Destination</th>
                <th className="p-3 border">Exam</th>
                <th className="p-3 border">Event</th>
                <th className="p-3 border">Course</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry, index) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="p-3 border">{inquiry.name}</td>
                  <td className="p-3 border">{inquiry.email}</td>
                  <td className="p-3 border">{inquiry.phone || "-"}</td>
                  <td className="p-3 border truncate max-w-[200px]" title={inquiry.message}>{inquiry.message || "-"}</td>
                  <td className="p-3 border">{inquiry.entity_type}</td>
                  <td className="p-3 border">{inquiry.consultancy_name || "-"}</td>
                  <td className="p-3 border">{inquiry.university_name || "-"}</td>
                  <td className="p-3 border">{inquiry.destination_name || "-"}</td>
                  <td className="p-3 border">{inquiry.exam_name || "-"}</td>
                  <td className="p-3 border">{inquiry.event_name || "-"}</td>
                  <td className="p-3 border">{inquiry.course_name || "-"}</td>
                  <td className="p-3 border">{new Date(inquiry.created_at).toLocaleString()}</td>
                  <td className="p-3 border">
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
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* View More Modal */}
      {showDetails && selectedInquiry && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        >
          <div className="relative bg-white max-w-2xl w-full rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Inquiry Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div><strong>Name:</strong> {selectedInquiry.name}</div>
              <div><strong>Email:</strong> {selectedInquiry.email}</div>
              <div><strong>Phone:</strong> {selectedInquiry.phone || "-"}</div>
              <div><strong>Entity Type:</strong> {selectedInquiry.entity_type}</div>
              <div><strong>Consultancy:</strong> {selectedInquiry.consultancy_name || "-"}</div>
              <div><strong>University:</strong> {selectedInquiry.university_name || "-"}</div>
              <div><strong>Destination:</strong> {selectedInquiry.destination_name || "-"}</div>
              <div><strong>Exam:</strong> {selectedInquiry.exam_name || "-"}</div>
              <div><strong>Event:</strong> {selectedInquiry.event_name || "-"}</div>
              <div><strong>Course:</strong> {selectedInquiry.course_name || "-"}</div>
              <div><strong>Submitted:</strong> {new Date(selectedInquiry.created_at).toLocaleString()}</div>
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

export default UniversityInquiries;
