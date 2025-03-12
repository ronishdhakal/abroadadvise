"use client";

import { useEffect, useState } from "react";
import Head from "next/head"; // ✅ SEO optimization
import AdminLayout from "@/components/admin/AdminLayout";
import ConsultancyForm from "@/components/admin/ConsultancyForm";
import {
  fetchConsultancies,
  deleteConsultancy,
  fetchDestinations,
  fetchExams,
  fetchUniversities,
  fetchDistricts,
  fetchConsultancyDetails,
} from "@/utils/api";

const ConsultanciesPage = ({ initialConsultancies }) => {
  const [consultancies, setConsultancies] = useState(initialConsultancies);
  const [allDestinations, setAllDestinations] = useState([]);
  const [allExams, setAllExams] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch consultancies dynamically when page or search query changes
  const loadConsultancies = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchConsultancies(page, search);
      console.log("✅ Fetched Consultancies Data:", data.results);
      setConsultancies(data.results);
    } catch (err) {
      console.error("❌ Failed to load consultancies:", err);
      setError("Failed to load consultancies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultancies();
  }, [page, search]);

  // ✅ Fetch Study Destinations, Exams, Universities, and Districts for Dropdowns
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const destinationsData = await fetchDestinations();
        setAllDestinations(destinationsData.results || []);

        const examsData = await fetchExams();
        setAllExams(examsData.results || []);

        const universitiesData = await fetchUniversities();
        setAllUniversities(universitiesData.results || []);

        const districtsData = await fetchDistricts();
        setAllDistricts(districtsData.results || []);
      } catch (err) {
        console.error("❌ Failed to load options:", err);
        setError(
          "Failed to load study destinations, exams, universities, or districts."
        );
      }
    };

    loadOptions();
  }, []);

  // ✅ Handle Delete Consultancy
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this consultancy?")) return;

    // Optimistic UI update
    const originalConsultancies = [...consultancies];
    setConsultancies((prev) => prev.filter((c) => c.slug !== slug));

    try {
      await deleteConsultancy(slug);
      setSuccessMessage("Consultancy deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete consultancy:", err);
      setError("Failed to delete consultancy.");
      setConsultancies(originalConsultancies); // Revert UI on failure
    }
  };

  // ✅ Handle Edit Consultancy (Pre-fill Form)
  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const consultancyData = await fetchConsultancyDetails(slug);
      console.log("✅ Editing Consultancy:", consultancyData);
      setEditingData(consultancyData);
    } catch (err) {
      console.error("❌ Failed to load consultancy details:", err);
      setError("Failed to load consultancy details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Successful Create/Update
  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Consultancy saved successfully!");
    loadConsultancies();
  };

  return (
    <AdminLayout>
      {/* ✅ SEO Optimization */}
      <Head>
        <title>Manage Consultancies | Admin Panel</title>
        <meta name="description" content="Manage consultancies in Abroad Advise admin panel. Add, edit, and delete consultancy records seamlessly." />
      </Head>

      <h1 className="text-2xl font-bold mb-4">Manage Consultancies</h1>

      {/* ✅ Success Message */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* ✅ Search Functionality */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search consultancies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <button onClick={loadConsultancies} className="bg-blue-500 text-white px-4 py-2 rounded">
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
        {showForm ? "Cancel" : "Add New Consultancy"}
      </button>

      {/* ✅ Consultancy Form */}
      {showForm && (
        <ConsultancyForm
          consultancySlug={editingSlug}
          consultancyData={editingData}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingSlug(null);
            setEditingData(null);
          }}
          allDestinations={allDestinations}
          allExams={allExams}
          allUniversities={allUniversities}
          allDistricts={allDistricts}
        />
      )}

      {/* ✅ Error Handling */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Loading State */}
      {loading ? (
        <p>Loading consultancies...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Verified</th>
              <th className="border p-2">Logo</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultancies.map((consultancy, index) => (
              <tr key={consultancy.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{consultancy.name}</td>
                <td className="border p-2">{consultancy.is_verified ? "Yes" : "No"}</td>
                <td className="border p-2">
                  {consultancy.logo ? (
                    <img
                      src={consultancy.logo}
                      alt="Logo"
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    "No Logo"
                  )}
                </td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(consultancy.slug)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(consultancy.slug)} className="bg-red-500 text-white px-3 py-1 rounded">
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

// ✅ Server-Side Rendering
export async function getServerSideProps() {
  try {
    const consultancies = await fetchConsultancies();
    return { props: { initialConsultancies: consultancies.results || [] } };
  } catch (error) {
    return { props: { initialConsultancies: [] } };
  }
}

export default ConsultanciesPage;
