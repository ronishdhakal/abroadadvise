"use client";

import { useEffect, useState } from "react";
import Head from "next/head"; // ✅ SEO optimization
import AdminLayout from "@/components/admin/AdminLayout";
import UniversityForm from "@/components/admin/UniversityForm";
import { fetchUniversities, deleteUniversity, fetchUniversityDetails, fetchDisciplines } from "@/utils/api";

const UniversitiesPage = ({ initialUniversities, allDisciplines }) => {
  const [universities, setUniversities] = useState(initialUniversities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch universities dynamically when page or search query changes
  const loadUniversities = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchUniversities(page, search);
      console.log("✅ Fetched Universities Data:", data.results);
      setUniversities(data.results);
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

  // ✅ Handle Delete University
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this university?")) return;

    // Optimistically update UI
    const originalUniversities = [...universities];
    setUniversities((prev) => prev.filter((u) => u.slug !== slug));

    try {
      await deleteUniversity(slug);
      setSuccessMessage("University deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete university:", err);
      setError("Failed to delete university.");
      setUniversities(originalUniversities); // Revert UI on failure
    }
  };

  // ✅ Handle Edit University (Pre-fill Form)
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

  // ✅ Handle Successful Create/Update
  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ University saved successfully!");
    loadUniversities();
  };

  return (
    <AdminLayout>
      {/* ✅ SEO Optimization */}
      <Head>
        <title>Manage Universities | Admin Panel</title>
        <meta name="description" content="Manage universities in Abroad Advise admin panel. Add, edit, and delete university records seamlessly." />
      </Head>

      <h1 className="text-2xl font-bold mb-4">Manage Universities</h1>

      {/* ✅ Success Message */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* ✅ Search Functionality */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search universities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <button onClick={loadUniversities} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {/* ✅ Toggle Form for Create/Edit */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingSlug(null);
          setEditingData(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Cancel" : "Add New University"}
      </button>

      {/* ✅ University Form */}
      {showForm && (
        <UniversityForm
          universitySlug={editingSlug}
          universityData={editingData}
          allDisciplines={allDisciplines} // ✅ Pass disciplines
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingSlug(null);
            setEditingData(null);
          }}
        />
      )}

      {/* ✅ Error Handling */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Loading State */}
      {loading ? (
        <p>Loading universities...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Verified</th>
              <th className="border p-2">Logo</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((university, index) => (
              <tr key={university.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{university.name}</td>
                <td className="border p-2">{university.country || "N/A"}</td>
                <td className="border p-2">{university.is_verified ? "Yes" : "No"}</td>
                <td className="border p-2">
                  {university.logo ? <img src={university.logo} alt="Logo" className="w-12 h-12 object-contain" /> : "No Logo"}
                </td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(university.slug)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(university.slug)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

// ✅ Server-Side Rendering (Ensures fresh data on each request)
export async function getServerSideProps() {
  try {
    const universities = await fetchUniversities();
    const disciplines = await fetchDisciplines(); // ✅ Fetch disciplines

    return {
      props: {
        initialUniversities: universities.results || [],
        allDisciplines: disciplines.results || [],
      },
    };
  } catch (error) {
    return {
      props: {
        initialUniversities: [],
        allDisciplines: [],
      },
    };
  }
}

export default UniversitiesPage;
