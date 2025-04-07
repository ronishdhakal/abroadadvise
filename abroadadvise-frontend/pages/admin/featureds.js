"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import FeaturedForm from "@/components/admin/FeaturedForm";
import FeaturedDetail from "@/components/admin/featured/FeaturedDetail";
import Pagination from "@/pages/consultancy/Pagination";
import {
  getFeaturedPages,
  deleteFeaturedPage,
  getFeaturedBySlug,
} from "@/utils/api";

const FeaturedsPage = () => {
  const [featuredPages, setFeaturedPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadFeaturedPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeaturedPages({ page, search });
      setFeaturedPages(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10));
    } catch (err) {
      console.error("❌ Failed to load featured pages:", err);
      setError("Failed to load featured pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedPages();
  }, [page, search]);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this featured page?")) return;
    const original = [...featuredPages];
    setFeaturedPages((prev) => prev.filter((p) => p.slug !== slug));
    try {
      await deleteFeaturedPage(slug);
      setSuccessMessage("✅ Featured page deleted successfully!");
    } catch (err) {
      setError("Failed to delete featured page.");
      setFeaturedPages(original);
    }
  };

  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);
    try {
      const data = await getFeaturedBySlug(slug);
      setEditingData(data);
    } catch (err) {
      setError("Failed to load featured page details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Featured page saved successfully!");
    loadFeaturedPages();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Featured Pages | Admin Panel</title>
        <meta
          name="description"
          content="Manage featured pages in Abroad Advise admin panel. Add, edit, and delete featured content easily."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Featured Pages</h1>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search featured pages..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
            />
            <button
              onClick={loadFeaturedPages}
              className="bg-[#4c9bd5] text-white px-4 py-3 rounded-lg hover:bg-[#3a8cc4] transition-all"
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
            {showForm ? "Cancel" : "Add New Featured Page"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <FeaturedForm
              slug={editingSlug}
              featuredData={editingData}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingSlug(null);
                setEditingData(null);
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-6 text-gray-600">Loading featured pages...</div>
        ) : featuredPages.length === 0 ? (
          <div className="text-center py-6 text-gray-600">No featured pages found.</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold min-w-[50px]">#</th>
                    <th className="p-4 text-left font-semibold min-w-[200px]">Title</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Slug</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Priority</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Status</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {featuredPages.map((page, index) => (
                    <tr
                      key={page.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <td className="p-4 text-gray-600">{index + 1 + (page - 1) * 10}</td>
                      <td className="p-4 text-gray-800">{page.title}</td>
                      <td className="p-4 text-gray-600">{page.slug}</td>
                      <td className="p-4 text-gray-600">{page.priority}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            page.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {page.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(page.slug)}
                          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(page.slug)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
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
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default FeaturedsPage;
