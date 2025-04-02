"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { getAllInquiries } from "@/utils/api";
import { X } from "lucide-react";

const InquiriesPage = () => {
  const [allInquiries, setAllInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllInquiries(currentPage);
      if (response?.results) {
        setAllInquiries(response.results);
        setFilteredInquiries(response.results); // default filtered
        setTotalPages(Math.ceil(response.count / 10));
      } else {
        setAllInquiries([]);
        setFilteredInquiries([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
      setError("Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [currentPage]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredInquiries(allInquiries);
    } else {
      const filtered = allInquiries.filter((inquiry) =>
        inquiry.consultancy_name?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredInquiries(filtered);
    }
  }, [search, allInquiries]);

  const openDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setSelectedInquiry(null);
    setShowDetails(false);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Inquiries | Admin Panel</title>
      </Head>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all student inquiries from one place</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by consultancy name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs px-4 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setSearch("")}
            className="text-sm px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
          >
            Clear
          </button>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading inquiries...</div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No inquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-blue-50 text-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">SN</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Name</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Email</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Phone</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Message</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Consultancy</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">University</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">College</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Destination</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Exam</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Event</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Course</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Created At</th>
                    <th className="p-4 text-left text-xs uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry, index) => (
                    <tr key={inquiry.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4">{(currentPage - 1) * 10 + index + 1}</td>
                      <td className="p-4">{inquiry.name}</td>
                      <td className="p-4">{inquiry.email}</td>
                      <td className="p-4">{inquiry.phone || "-"}</td>
                      <td className="p-4 truncate max-w-[200px]" title={inquiry.message}>{inquiry.message || "-"}</td>
                      <td className="p-4">{inquiry.consultancy_name || "-"}</td>
                      <td className="p-4">{inquiry.university_name || "-"}</td>
                      <td className="p-4">{inquiry.college_name || "-"}</td>
                      <td className="p-4">{inquiry.destination_name || "-"}</td>
                      <td className="p-4">{inquiry.exam_name || "-"}</td>
                      <td className="p-4">{inquiry.event_name || "-"}</td>
                      <td className="p-4">{inquiry.course_name || "-"}</td>
                      <td className="p-4">{new Date(inquiry.created_at).toLocaleString()}</td>
                      <td className="p-4">
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

        {/* Modal */}
        {showDetails && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
            <div className="bg-white max-w-2xl w-full p-8 rounded-2xl shadow-2xl relative border border-gray-100">
              <button
                onClick={closeDetails}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Inquiry Details</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Name:</strong> {selectedInquiry.name}</p>
                <p><strong>Email:</strong> {selectedInquiry.email}</p>
                <p><strong>Phone:</strong> {selectedInquiry.phone || "-"}</p>
                <p><strong>Consultancy:</strong> {selectedInquiry.consultancy_name || "-"}</p>
                <p><strong>University:</strong> {selectedInquiry.university_name || "-"}</p>
                <p><strong>College:</strong> {selectedInquiry.college_name || "-"}</p>
                <p><strong>Destination:</strong> {selectedInquiry.destination_name || "-"}</p>
                <p><strong>Exam:</strong> {selectedInquiry.exam_name || "-"}</p>
                <p><strong>Event:</strong> {selectedInquiry.event_name || "-"}</p>
                <p><strong>Course:</strong> {selectedInquiry.course_name || "-"}</p>
                <p><strong>Created At:</strong> {new Date(selectedInquiry.created_at).toLocaleString()}</p>
                <p><strong>Message:</strong><br />{selectedInquiry.message || "-"}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetails}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InquiriesPage;
