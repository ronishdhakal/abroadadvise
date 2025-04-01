"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import Pagination from "@/pages/consultancy/Pagination";
import ScholarshipForm from "@/components/admin/ScholarshipForm";
import {
  fetchScholarships,
  deleteScholarship,
  fetchDestinations,
  fetchScholarshipDetails,
} from "@/utils/api";

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadScholarships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchScholarships(page, search);
      setScholarships(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      setError("Failed to load scholarships.");
    } finally {
      setLoading(false);
    }
  };

  const loadDestinations = async () => {
    try {
      const data = await fetchDestinations();
      setAllDestinations(data.results || []);
    } catch (err) {
      setError("Failed to load destinations.");
    }
  };

  useEffect(() => {
    loadScholarships();
    loadDestinations();
  }, [page, search]);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;

    const original = [...scholarships];
    setScholarships((prev) => prev.filter((s) => s.slug !== slug));

    try {
      await deleteScholarship(slug);
      setSuccessMessage("Scholarship deleted successfully!");
    } catch (err) {
      setError("Failed to delete scholarship.");
      setScholarships(original);
    }
  };

  const handleEdit = async (slug) => {
    setEditingSlug(slug);
    setShowForm(true);
    setLoading(true);

    try {
      const data = await fetchScholarshipDetails(slug);
      setEditingData(data);
    } catch (err) {
      setError("Failed to load scholarship details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Scholarship saved successfully!");
    loadScholarships();
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Scholarships | Admin Panel</title>
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Scholarships</h1>

        {successMessage && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">{successMessage}</div>}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search scholarships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5]"
            />
            <button
              onClick={loadScholarships}
              className="bg-[#4c9bd5] text-white px-4 py-3 rounded-lg hover:bg-[#3a8cc4]"
            >
              Search
            </button>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingSlug(null);
              setEditingData(null);
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              showForm
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-[#4c9bd5] text-white hover:bg-[#3a8cc4]"
            }`}
          >
            {showForm ? "Cancel" : "Add New Scholarship"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <ScholarshipForm
              scholarshipSlug={editingSlug}
              scholarshipData={editingData}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingSlug(null);
                setEditingData(null);
              }}
              allDestinations={allDestinations}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600 py-6">Loading scholarships...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left">#</th>
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">By</th>
                    <th className="p-4 text-left">Level</th>
                    <th className="p-4 text-left">Destination</th>
                    <th className="p-4 text-left">Image</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((scholarship, index) => (
                    <tr key={scholarship.id} className="border-t hover:bg-gray-50 transition-all">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{scholarship.title}</td>
                      <td className="p-4">{scholarship.by}</td>
                      <td className="p-4 capitalize">{scholarship.study_level || "-"}</td>
                      <td className="p-4">{scholarship.destination?.title || "-"}</td>
                      <td className="p-4">
                        {scholarship.featured_image ? (
                          <img
                            src={scholarship.featured_image}
                            alt="Featured"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(scholarship.slug)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(scholarship.slug)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ScholarshipsPage;
