"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CollegeForm from "@/components/admin/CollegeForm";
import {
  fetchColleges,
  deleteCollege,
  fetchDestinations,
  fetchUniversities,
  fetchDistricts,
  fetchCollegeDetails,
} from "@/utils/api";
import Head from "next/head";
import Pagination from "@/pages/consultancy/Pagination";

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadColleges = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchColleges(page, search);
      setColleges(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      console.error("❌ Failed to load colleges:", err);
      setError("Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const destinationsData = await fetchDestinations();
      setAllDestinations(destinationsData.results || []);

      const universitiesData = await fetchUniversities();
      setAllUniversities(universitiesData.results || []);

      const districtsData = await fetchDistricts();
      setAllDistricts(districtsData.results || []);
    } catch (err) {
      console.error("❌ Failed to load options:", err);
      setError("Failed to load destinations, universities, or districts.");
    }
  };

  useEffect(() => {
    loadColleges();
    loadOptions();
  }, [page, search]);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this college?")) return;

    const originalColleges = [...colleges];
    setColleges((prev) => prev.filter((c) => c.slug !== slug));

    try {
      await deleteCollege(slug);
      setSuccessMessage("College deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete college:", err);
      setError("Failed to delete college.");
      setColleges(originalColleges);
    }
  };

  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const collegeData = await fetchCollegeDetails(slug);
      setEditingData(collegeData);
    } catch (err) {
      console.error("❌ Failed to load college details for editing:", err);
      setError("Failed to load college details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ College saved successfully!");
    loadColleges();
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Colleges | Admin Panel</title>
        <meta
          name="description"
          content="Manage colleges in Abroad Advise admin panel. Add, edit, and delete college records."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Colleges</h1>

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
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5]"
            />
            <button
              onClick={loadColleges}
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
            {showForm ? "Cancel" : "Add New College"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <CollegeForm
              collegeSlug={editingSlug}
              collegeData={editingData}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingSlug(null);
                setEditingData(null);
              }}
              allDestinations={allDestinations}
              allUniversities={allUniversities}
              allDistricts={allDistricts}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-6 text-gray-600">Loading colleges...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold">#</th>
                    <th className="p-4 text-left font-semibold">Name</th>
                    <th className="p-4 text-left font-semibold">Verified</th>
                    <th className="p-4 text-left font-semibold">Logo</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((college, index) => (
                    <tr key={college.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{college.name}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            college.verified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {college.verified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4">
                        {college.logo ? (
                          <img
                            src={college.logo}
                            alt="Logo"
                            className="w-12 h-12 object-contain rounded"
                          />
                        ) : (
                          <span className="text-gray-500">No Logo</span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(college.slug)}
                          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(college.slug)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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

export default CollegesPage;
