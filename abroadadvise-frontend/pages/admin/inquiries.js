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

    // ✅ Backend Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ✅ Fetch paginated inquiries from API
    const loadInquiries = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getAllInquiries(page);
            console.log("✅ Fetched Inquiries Data:", data);

            setInquiries(data.results || []);
            setTotalPages(Math.ceil(data.count / 10)); // ✅ Update total pages
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

            <h1 className="text-2xl font-bold mb-4">Manage Inquiries</h1>

            {/* ✅ Search Bar */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Search inquiries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                />
                <button onClick={() => loadInquiries(1)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Refresh
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {loading ? (
                <p>Loading inquiries...</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full min-w-[1400px] border-collapse border">
                        <thead>
                            <tr className="bg-gray-100 text-xs md:text-sm text-gray-700">
                                <th className="border p-3">#</th>
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Email</th>
                                <th className="border p-3">Phone</th>
                                <th className="border p-3">Message</th>
                                <th className="border p-3">Entity Type</th>
                                <th className="border p-3">Entity ID</th>
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
                                        <td className="border p-3">{inquiry.entity_id}</td>
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
                                    <td colSpan="14" className="text-center p-4">
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
                <div className="flex justify-center mt-4">
                    <button onClick={() => loadInquiries(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded">
                        Prev
                    </button>
                    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => loadInquiries(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 rounded">
                        Next
                    </button>
                </div>
            )}
        </AdminLayout>
    );
};

export default InquiriesPage;
