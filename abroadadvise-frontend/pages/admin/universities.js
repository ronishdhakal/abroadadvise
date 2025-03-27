"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import UniversityForm from "@/components/admin/UniversityForm";
import { fetchUniversities, deleteUniversity, fetchUniversityDetails, fetchDisciplines } from "@/utils/api";
import Pagination from "@/pages/consultancy/Pagination";

const UniversitiesPage = ({ initialUniversities, allDisciplines, initialTotalPages }) => {
  const [universities, setUniversities] = useState(initialUniversities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadUniversities = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchUniversities(page, search);
      console.log("✅ Fetched Universities Data:", data.results);
      setUniversities(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      console.error("❌ Failed to load universities:", err);
      setError("Failed to load universities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, [page, search]);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this university?")) return;

    const originalUniversities = [...universities];
    setUniversities((prev) => prev.filter((u) => u.slug !== slug));

    try {
      await deleteUniversity(slug);
      setSuccessMessage("University deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete university:", err);
      setError("Failed to delete university.");
      setUniversities(originalUniversities);
    }
  };

  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const universityData = await fetchUniversityDetails(slug);
      console.log("✅ Editing University:", universityData);
      setEditingData(universityData);
    } catch (err) {
      console.error("❌ Failed to load university details:", err);
      setError("Failed to load university details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ University saved successfully!");
    loadUniversities();
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Universities | Admin Panel</title>
        <meta
          name="description"
          content="Manage universities in Abroad Advise admin panel. Add, edit, and delete university records seamlessly."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Universities</h1>

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
              placeholder="Search universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
            />
            <button
              onClick={loadUniversities}
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
            {showForm ? "Cancel" : "Add New University"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <UniversityForm
              universitySlug={editingSlug}
              universityData={editingData}
              allDisciplines={allDisciplines}
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
          <div className="text-center py-6 text-gray-600">Loading universities...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold min-w-[50px]">#</th>
                    <th className="p-4 text-left font-semibold min-w-[200px]">Name</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Country</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Verified</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Logo</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((university, index) => (
                    <tr
                      key={university.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <td className="p-4 text-gray-600">{index + 1}</td>
                      <td className="p-4 text-gray-800">{university.name}</td>
                      <td className="p-4 text-gray-600">{university.country || "N/A"}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            university.is_verified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {university.is_verified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4">
                        {university.logo ? (
                          <img
                            src={university.logo}
                            alt="Logo"
                            className="w-12 h-12 object-contain rounded"
                          />
                        ) : (
                          <span className="text-gray-500">No Logo</span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(university.slug)}
                          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(university.slug)}
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

export async function getServerSideProps() {
  try {
    const universities = await fetchUniversities();
    const disciplines = await fetchDisciplines();

    return {
      props: {
        initialUniversities: universities.results || [],
        allDisciplines: disciplines.results || [],
        initialTotalPages: Math.ceil(universities.count / 10) || 1,
      },
    };
  } catch (error) {
    return {
      props: {
        initialUniversities: [],
        allDisciplines: [],
        initialTotalPages: 1,
      },
    };
  }
}

export default UniversitiesPage;