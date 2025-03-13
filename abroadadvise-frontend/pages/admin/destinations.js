"use client";

import { useEffect, useState } from "react";
import Head from "next/head"; // ✅ SEO optimization
import AdminLayout from "@/components/admin/AdminLayout";
import DestinationForm from "@/components/admin/DestinationForm";
import { 
  fetchDestinations, 
  deleteDestination, 
  fetchDestinationDetails 
} from "@/utils/api";

const DestinationsPage = ({ initialDestinations }) => {
  const [destinations, setDestinations] = useState(initialDestinations || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch destinations dynamically when page or search query changes
  const loadDestinations = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchDestinations(page, search);
      console.log("✅ Fetched Destinations Data:", data.results);
      setDestinations(data.results || []);
    } catch (err) {
      console.error("❌ Failed to load destinations:", err);
      setError("Failed to load destinations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, [page, search]);

  // ✅ Handle Delete Destination
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;

    // Optimistic UI update
    const originalDestinations = [...destinations];
    setDestinations((prev) => prev.filter((d) => d.slug !== slug));

    try {
      await deleteDestination(slug);
      setSuccessMessage("✅ Destination deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete destination:", err);
      setError("❌ Failed to delete destination.");
      setDestinations(originalDestinations); // Revert UI on failure
    }
  };

  // ✅ Handle Edit Destination (Pre-fill Form)
  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const destinationData = await fetchDestinationDetails(slug);
      console.log("✅ Editing Destination:", destinationData);
      setEditingData(destinationData);  // Fill in data for editing
    } catch (err) {
      console.error("❌ Failed to load destination details:", err);
      setError("❌ Failed to load destination details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Successful Create/Update
  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Destination saved successfully!");
    loadDestinations();
  };

  return (
    <AdminLayout>
      {/* ✅ SEO Optimization */}
      <Head>
        <title>Manage Destinations | Admin Panel</title>
        <meta name="description" content="Manage study destinations in Abroad Advise admin panel. Add, edit, and delete destination records seamlessly." />
      </Head>

      <h1 className="text-2xl font-bold mb-4">Manage Destinations</h1>

      {/* ✅ Success Message */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* ✅ Search Functionality */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <button onClick={loadDestinations} className="bg-blue-500 text-white px-4 py-2 rounded">
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
        {showForm ? "Cancel" : "Add New Destination"}
      </button>

      {/* ✅ Destination Form */}
      {showForm && (
        <DestinationForm
          destinationSlug={editingSlug}
          destinationData={editingData}
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
        <p>Loading destinations...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Country Logo</th>
              <th className="border p-2">Cover Page</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length > 0 ? (
              destinations.map((destination, index) => (
                <tr key={destination.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{destination.title}</td>
                  <td className="border p-2">
                    {destination.country_logo ? (
                      <img
                        src={destination.country_logo}
                        alt="Country Logo"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      "No Logo"
                    )}
                  </td>
                  <td className="border p-2">
                    {destination.cover_page ? (
                      <img
                        src={destination.cover_page}
                        alt="Cover Page"
                        className="w-16 h-12 object-cover"
                      />
                    ) : (
                      "No Cover"
                    )}
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(destination.slug)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(destination.slug)} className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No destinations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

// ✅ Server-Side Rendering
export async function getServerSideProps() {
  try {
    const destinations = await fetchDestinations();
    return { props: { initialDestinations: destinations.results || [] } };
  } catch (error) {
    return { props: { initialDestinations: [] } };
  }
}

export default DestinationsPage;
