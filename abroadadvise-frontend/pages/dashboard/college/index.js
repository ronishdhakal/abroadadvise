"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CollegeSidebar from "@/pages/dashboard/college/CollegeSidebar";
import { API_BASE_URL, fetchCollegeDashboard } from "@/utils/api";
import { Users, Globe, Edit, ExternalLink, MapPin, Mail, Phone } from "lucide-react";

const CollegeDashboard = () => {
  const [college, setCollege] = useState(null);
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
        const data = await fetchCollegeDashboard();
        setCollege(data);
      } catch (error) {
        console.error("❌ Error fetching college data:", error);
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
        const token = localStorage.getItem("accessToken");
        const collegeId = localStorage.getItem("college_id");

        if (!token || !collegeId) {
          setInquiriesError("Authentication failed. Please log in again.");
          return;
        }

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
          setInquiriesError(errorData.detail || "Failed to fetch inquiries");
        } else {
          const data = await response.json();
          setInquiries(data.results || []);
          setTotalPages(Math.ceil(data.count / 10));
        }
      } catch (error) {
        setInquiriesError("Error fetching inquiries");
      } finally {
        setInquiriesLoading(false);
      }
    };

    fetchInquiries();
  }, [currentPage]);

  if (loading) return <div className="p-10 text-center">Loading college dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CollegeSidebar />
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {college?.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Your dashboard overview</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/college/profile")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            <Edit className="w-4 h-4 mr-1 inline" /> Edit Profile
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-5 rounded-md shadow-sm flex items-center gap-4">
            <Users className="text-blue-600 w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">{college?.affiliated_universities?.length || 0}</h2>
              <p className="text-sm text-gray-500">Affiliated Universities</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-md shadow-sm flex items-center gap-4">
            <Globe className="text-blue-600 w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">{college?.study_abroad_destinations?.length || 0}</h2>
              <p className="text-sm text-gray-500">Study Destinations</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-md shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">College Information</h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <p><Mail className="inline w-4 h-4 mr-1" /> {college?.email || "-"}</p>
            <p><Phone className="inline w-4 h-4 mr-1" /> {college?.phone || "-"}</p>
            <p><MapPin className="inline w-4 h-4 mr-1" /> {college?.address || "-"}</p>
            {college?.website && (
              <p>
                <ExternalLink className="inline w-4 h-4 mr-1" />
                <a href={college.website} target="_blank" className="text-blue-600 underline">
                  {college.website}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* About / Services */}
        {college?.about && (
          <div className="bg-white p-6 rounded-md shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About Us</h3>
            <div className="prose text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: college.about }} />
          </div>
        )}
        {college?.services && (
          <div className="bg-white p-6 rounded-md shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Services</h3>
            <div className="prose text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: college.services }} />
          </div>
        )}

        {/* Inquiries */}
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Inquiries</h3>
          {inquiriesLoading ? (
            <p className="text-gray-500">Loading inquiries...</p>
          ) : inquiries.length === 0 ? (
            <p className="text-gray-500">No inquiries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-t">
                      <td className="p-3">{inquiry.name}</td>
                      <td className="p-3">{inquiry.email}</td>
                      <td className="p-3">{inquiry.phone || "-"}</td>
                      <td className="p-3 truncate max-w-xs">{inquiry.message}</td>
                      <td className="p-3">{new Date(inquiry.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
