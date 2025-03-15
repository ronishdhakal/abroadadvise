"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api"; // ✅ Ensure correct import

const UniversityInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // ✅ Track current page
  const [totalPages, setTotalPages] = useState(1); // ✅ Store total pages

  // Fetch inquiries when the component mounts or page changes
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch token and university ID from localStorage
        const token = localStorage.getItem("access_token"); 
        const universityId = localStorage.getItem("university_id");

        if (!token) {
          setError("User not logged in");
          console.error("❌ No token found in localStorage");
          return;
        }

        if (!universityId) {
          setError("University ID is missing. Please log in again.");
          console.error("❌ No university_id found in localStorage");
          return;
        }

        console.log("✅ Fetching inquiries for university_id:", universityId, "Page:", currentPage);
        console.log("✅ Sending Token:", token);

        // ✅ API Call with Pagination
        const response = await fetch(
          `${API_BASE_URL}/inquiry/admin/all/?page=${currentPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Ensure token is included
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ API Response Error:", errorData);
          setError(errorData.detail || "Failed to fetch inquiries");
        } else {
          const data = await response.json();
          console.log("✅ University Inquiry Data Received:", data);

          setInquiries(data.results || []);
          setTotalPages(Math.ceil(data.count / 10)); // ✅ Calculate total pages
        }
      } catch (error) {
        console.error("❌ Inquiry Fetch Error:", error);
        setError(error.message || "Error fetching inquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [currentPage]); // ✅ Re-fetch when `currentPage` changes

  // Display loading, error, or the inquiries list
  if (loading) {
    return <p>Loading inquiries...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="inquiries-section">
      <h2 className="text-xl font-bold">University Inquiries</h2>
      {inquiries.length === 0 ? (
        <p>No inquiries yet. Once your university is active, inquiries will appear here.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full min-w-[1000px] border-collapse border">
            <thead>
              <tr className="bg-gray-100 text-xs md:text-sm text-gray-700">
                <th className="border p-3">#</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Phone</th>
                <th className="border p-3">Message</th>
                <th className="border p-3">Entity Type</th>
                <th className="border p-3">Consultancy</th>
                <th className="border p-3">University</th>
                <th className="border p-3">Destination</th>
                <th className="border p-3">Exam</th>
                <th className="border p-3">Event</th>
                <th className="border p-3">Course</th>
                <th className="border p-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry, index) => (
                  <tr key={inquiry.id} className="text-xs md:text-sm hover:bg-gray-50">
                    <td className="border p-3">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="border p-3">{inquiry.name}</td>
                    <td className="border p-3">{inquiry.email}</td>
                    <td className="border p-3">{inquiry.phone || "-"}</td>
                    <td className="border p-3 max-w-xs truncate" title={inquiry.message}>
                      {inquiry.message || "-"}
                    </td>
                    <td className="border p-3">{inquiry.entity_type}</td>
                    <td className="border p-3">{inquiry.consultancy_name || "-"}</td>
                    <td className="border p-3">{inquiry.university_name || "-"}</td>
                    <td className="border p-3">{inquiry.destination_name || "-"}</td>
                    <td className="border p-3">{inquiry.exam_name || "-"}</td>
                    <td className="border p-3">{inquiry.event_name || "-"}</td>
                    <td className="border p-3">{inquiry.course_name || "-"}</td>
                    <td className="border p-3">{new Date(inquiry.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center p-4">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversityInquiries;
