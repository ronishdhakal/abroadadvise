"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversitySidebar from "./UniversitySidebar";
import { fetchUniversityDashboard, API_BASE_URL } from "@/utils/api";
import { Globe, Mail, Phone, Landmark, MapPin, Edit, ExternalLink } from "lucide-react";

const UniversityDashboard = () => {
  const [university, setUniversity] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiriesError, setInquiriesError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching university data...");
        const universityData = await fetchUniversityDashboard();
        setUniversity(universityData);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setInquiriesLoading(true);
        setInquiriesError(null);

        const token = localStorage.getItem("access_token");
        const universityId = localStorage.getItem("university_id");

        if (!token) {
          setInquiriesError("User not logged in");
          return;
        }

        if (!universityId) {
          setInquiriesError("University ID is missing. Please log in again.");
          return;
        }

        console.log("✅ Fetching inquiries for university_id:", universityId, "Page:", currentPage);

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
          setInquiriesError(errorData.detail || "Failed to fetch inquiries");
        } else {
          const data = await response.json();
          console.log("✅ Inquiry Data Received:", data);
          setInquiries(data.results || []);
          setTotalPages(Math.ceil(data.count / 10));
        }
      } catch (error) {
        setInquiriesError(error.message || "Error fetching inquiries");
      } finally {
        setInquiriesLoading(false);
      }
    };

    fetchInquiries();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
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
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-center py-6 text-red-600 bg-red-50 p-6 rounded-lg shadow-md max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UniversitySidebar />

      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, {university?.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Your hub for managing university operations and insights</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/university/profile")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4c9bd5] text-white rounded-lg hover:bg-[#3d8bc5] focus:ring-2 focus:ring-[#4c9bd5]/30 focus:outline-none transition-all duration-300 text-sm font-medium shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="mb-10">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1.5 h-6 bg-[#4c9bd5] rounded-full mr-3"></div>
              University Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {university?.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800">{university.email}</p>
                    </div>
                  </div>
                )}

                {university?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-800">{university.phone}</p>
                    </div>
                  </div>
                )}

                {university?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-800">{university.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {university?.website && (
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      <a
                        href={university.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4c9bd5] hover:underline"
                      >
                        {university.website}
                      </a>
                    </div>
                  </div>
                )}

                {university?.country && (
                  <div className="flex items-start gap-3">
                    <Landmark className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Country</p>
                      <p className="text-gray-800">{university.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {university?.logo && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-5 bg-[#4c9bd5] rounded-full mr-2"></div>
                  Logo
                </h3>
                <img
                  src={university.logo}
                  alt="University Logo"
                  className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                />
              </div>
            )}

            {university?.cover_photo && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-5 bg-[#4c9bd5] rounded-full mr-2"></div>
                  Cover Photo
                </h3>
                <img
                  src={university.cover_photo}
                  alt="Cover Photo"
                  className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            
          </div>
        </div>

        <div className="mb-10">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-1.5 h-6 bg-[#4c9bd5] rounded-full mr-3"></div>
                Recent Inquiries
              </h2>
              <p className="text-sm text-gray-500 mt-1 ml-4">View and manage university inquiries</p>
            </div>
          </div>

          {inquiriesError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center text-sm shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0a10 10 0 100 20 10 10 0 000-20zm1 14H9v2h2v-2zm0-10H9v8h2V4z"
                  clipRule="evenodd"
                />
              </svg>
              {inquiriesError}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {inquiriesLoading ? (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="animate-spin h-8 w-8 mx-auto mb-3 text-[#4c9bd5]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                <p className="font-medium">Loading inquiries...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium mb-1">No inquiries yet</p>
                <p className="text-sm text-gray-400">Once your university is active, inquiries will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#4c9bd5]/5 text-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Name</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Email</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Contact Number</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Message</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Consultancy</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">University</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Destination</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Exam</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Event</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Course</th>
                      <th className="p-4 font-semibold text-left uppercase text-xs tracking-wider">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50 transition-all duration-200">
                        <td className="p-4 text-gray-800 font-medium">{inquiry.name}</td>
                        <td className="p-4 text-gray-700">{inquiry.email}</td>
                        <td className="p-4 text-gray-700">{inquiry.phone || "-"}</td>
                        <td className="p-4 text-gray-700 max-w-[200px] truncate" title={inquiry.message}>
                          {inquiry.message || "-"}
                        </td>
                        <td className="p-4 text-gray-700">{inquiry.consultancy_name || "-"}</td>
                        <td className="p-4 text-gray-700">{inquiry.university_name || "-"}</td>
                        <td className="p-4 text-gray-700">{inquiry.destination_name || "-"}</td>
                        <td className="p-4 text-gray-700">{inquiry.exam_name || "-"}</td>
                        <td className="p-4 text-gray-700">{inquiry.event_name || "-"}</td>
                        <td className="p-4 text-gray-700">{inquiry.course_name || "-"}</td>
                        <td className="p-4 text-gray-700">{new Date(inquiry.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#4c9bd5]/30 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#4c9bd5]/30 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm flex items-center gap-2"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;