"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ConsultancySidebar from "./ConsultancySidebar"
import { fetchConsultancyDashboard, API_BASE_URL } from "@/utils/api"
import { Users, BookOpen, Globe, Edit, ExternalLink, MapPin, Mail, Phone } from "lucide-react"

const ConsultancyDashboard = () => {
  const [consultancy, setConsultancy] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [inquiriesLoading, setInquiriesLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inquiriesError, setInquiriesError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching consultancy data...")
        const consultancyData = await fetchConsultancyDashboard()
        setConsultancy(consultancyData)
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error)
        setError("Failed to load dashboard data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Only fetch inquiries if consultancy is verified
    if (consultancy?.verified) {
      const fetchInquiries = async () => {
        try {
          setInquiriesLoading(true)
          setInquiriesError(null)

          const token = localStorage.getItem("accessToken")
          const consultancyId = localStorage.getItem("consultancy_id")

          if (!token) {
            setInquiriesError("User not logged in")
            return
          }

          if (!consultancyId) {
            setInquiriesError("Consultancy ID is missing. Please log in again.")
            return
          }

          console.log("✅ Fetching inquiries for consultancy_id:", consultancyId, "Page:", currentPage)

          const response = await fetch(
            `${API_BASE_URL}/inquiry/admin/all/?consultancy_id=${consultancyId}&page=${currentPage}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          )

          if (!response.ok) {
            const errorData = await response.json()
            setInquiriesError(errorData.detail || "Failed to fetch inquiries")
          } else {
            const data = await response.json()
            console.log("✅ Inquiry Data Received:", data)

            setInquiries(data.results || [])
            setTotalPages(Math.ceil(data.count / 10))
          }
        } catch (error) {
          setInquiriesError(error.message || "Error fetching inquiries")
        } finally {
          setInquiriesLoading(false)
        }
      }

      fetchInquiries()
    }
  }, [currentPage, consultancy?.verified])

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
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-center py-6 text-red-600 bg-red-50 p-6 rounded-lg shadow-md max-w-md">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ConsultancySidebar />

      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, {consultancy?.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Your hub for managing consultancy operations and insights</p>
          </div>
          <button
            onClick={() => router.push("http://localhost:3000/dashboard/consultancy/profile")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4c9bd5] text-white rounded-lg hover:bg-[#3d8bc5] focus:ring-2 focus:ring-[#4c9bd5]/30 focus:outline-none transition-all duration-300 text-sm font-medium shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#4c9bd5]/10 text-[#4c9bd5] group-hover:bg-[#4c9bd5]/15 transition-all">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{consultancy?.partner_universities?.length || 0}</h2>
                <p className="text-sm text-gray-500 font-medium">Partner Universities</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#4c9bd5]/10 text-[#4c9bd5] group-hover:bg-[#4c9bd5]/15 transition-all">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {consultancy?.study_abroad_destinations?.length || 0}
                </h2>
                <p className="text-sm text-gray-500 font-medium">Study Destinations</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#4c9bd5]/10 text-[#4c9bd5] group-hover:bg-[#4c9bd5]/15 transition-all">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{consultancy?.test_preparation?.length || 0}</h2>
                <p className="text-sm text-gray-500 font-medium">Test Preparation Courses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1.5 h-6 bg-[#4c9bd5] rounded-full mr-3"></div>
              Consultancy Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {consultancy?.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800">{consultancy.email}</p>
                    </div>
                  </div>
                )}

                {consultancy?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-800">{consultancy.phone}</p>
                    </div>
                  </div>
                )}

                {consultancy?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-800">{consultancy.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {consultancy?.website && (
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-[#4c9bd5] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      <a
                        href={consultancy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4c9bd5] hover:underline"
                      >
                        {consultancy.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {consultancy?.about && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-5 bg-[#4c9bd5] rounded-full mr-2"></div>
                  About Us
                </h3>
                <div
                  className="text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: consultancy.about }}
                />
              </div>
            )}

            {consultancy?.services && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-5 bg-[#4c9bd5] rounded-full mr-2"></div>
                  Our Services
                </h3>
                <div
                  className="text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: consultancy.services }}
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
              <p className="text-sm text-gray-500 mt-1 ml-4">View and manage consultancy inquiries</p>
            </div>
          </div>

          {consultancy?.verified ? (
            <>
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
                    <p className="text-sm text-gray-400">Once your consultancy is active, inquiries will appear here</p>
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
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700 mb-2">Upgrade Your Plan</p>
              <p className="text-sm text-gray-500">
                Please upgrade your plan to collect and view inquiries.
              </p>
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2.5 bg-[#4c9bd5] text-white rounded-lg hover:bg-[#3d8bc5] focus:ring-2 focus:ring-[#4c9bd5]/30 focus:outline-none transition-all duration-300 text-sm font-medium shadow-sm"
              >
                Learn More
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConsultancyDashboard