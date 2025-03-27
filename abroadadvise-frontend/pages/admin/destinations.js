"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import DestinationForm from "@/components/admin/DestinationForm";
import {
  fetchDestinations,
  deleteDestination,
  fetchDestinationDetails,
} from "@/utils/api";
import Pagination from "@/pages/destination/Pagination";

const DestinationsPage = ({ initialDestinations }) => {
  const [destinations, setDestinations] = useState(initialDestinations || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadDestinations = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchDestinations(page, search);
      console.log("✅ Fetched Destinations Data:", data.results);
      setDestinations(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
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

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this destination?"))
      return;

    const originalDestinations = [...destinations];
    setDestinations((prev) => prev.filter((d) => d.slug !== slug));

    try {
      await deleteDestination(slug);
      setSuccessMessage("✅ Destination deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete destination:", err);
      setError("❌ Failed to delete destination.");
      setDestinations(originalDestinations);
    }
  };

  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const destinationData = await fetchDestinationDetails(slug);
      console.log("✅ Editing Destination:", destinationData);
      setEditingData(destinationData);
    } catch (err) {
      console.error("❌ Failed to load destination details:", err);
      setError("❌ Failed to load destination details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Destination saved successfully!");
    loadDestinations();
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Destinations | Admin Panel</title>
        <meta
          name="description"
          content="Manage study destinations in Abroad Advise admin panel. Add, edit, and delete destination records seamlessly."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Destinations</h1>

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
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
            />
            <button
              onClick={loadDestinations}
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
            {showForm ? "Cancel" : "Add New Destination"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
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
          </div>
        )}

        {loading ? (
          <div className="text-center py-6 text-gray-600">Loading destinations...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold min-w-[50px]">#</th>
                    <th className="p-4 text-left font-semibold min-w-[200px]">Title</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Country Logo</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Cover Page</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.length > 0 ? (
                    destinations.map((destination, index) => (
                      <tr
                        key={destination.id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                      >
                        <td className="p-4 text-gray-600">{index + 1}</td>
                        <td className="p-4 text-gray-800">{destination.title}</td>
                        <td className="p-4">
                          {destination.country_logo ? (
                            <img
                              src={destination.country_logo}
                              alt="Country Logo"
                              className="w-12 h-12 object-contain rounded"
                            />
                          ) : (
                            <span className="text-gray-500">No Logo</span>
                          )}
                        </td>
                        <td className="p-4">
                          {destination.cover_page ? (
                            <img
                              src={destination.cover_page}
                              alt="Cover Page"
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-500">No Cover</span>
                          )}
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(destination.slug)}
                            className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(destination.slug)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-600">
                        No destinations found.
                      </td>
                    </tr>
                  )}
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
    const destinations = await fetchDestinations();
    return {
      props: {
        initialDestinations: destinations.results || [],
      },
    };
  } catch (error) {
    return { props: { initialDestinations: [] } };
  }
}

export default DestinationsPage;