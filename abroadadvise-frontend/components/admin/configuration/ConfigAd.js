"use client";

import { useEffect, useState } from "react";
import {
  fetchAds,
  createAd,
  updateAd,
  deleteAd,
} from "@/utils/api";
import Pagination from "@/components/Pagination";
import AdForm from "./AdForm";

const ConfigAd = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadAds();
  }, [page]);

  const loadAds = async () => {
    setLoading(true);
    try {
      const response = await fetchAds(page);
      setAds(response?.results || []);
      setTotalPages(Math.ceil((response?.count || 0) / 10));
    } catch (err) {
      console.error("❌ Failed to load ads:", err);
      setError("Failed to load ads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    try {
      if (editMode && selectedAd) {
        await updateAd(selectedAd.id, formData);
      } else {
        await createAd(formData);
      }
      setShowForm(false);
      setEditMode(false);
      setSelectedAd(null);
      loadAds();
    } catch (err) {
      console.error("❌ Failed to save ad:", err);
      setError("Failed to save ad. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    setLoading(true);
    try {
      await deleteAd(id);
      loadAds();
    } catch (err) {
      console.error("❌ Failed to delete ad:", err);
      setError("Failed to delete ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Advertisement Manager</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditMode(false);
            setSelectedAd(null);
          }}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-all font-medium"
          disabled={loading}
        >
          + Create New Ad
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0a10 10 0 100 20 10 10 0 000-20zm1 14H9v2h2v-2zm0-10H9v8h2V4z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editMode ? "Edit Advertisement" : "Add New Advertisement"}
          </h3>
          <AdForm
            initialData={selectedAd}
            editMode={editMode}
            onCancel={() => {
              setShowForm(false);
              setSelectedAd(null);
              setEditMode(false);
            }}
            onSubmit={handleCreateOrUpdate}
          />
        </section>
      )}

      {/* Ads List */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Ads</h3>
        {loading ? (
          <div className="text-center py-6 text-gray-500">
            <svg
              className="animate-spin h-6 w-6 mx-auto mb-2 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
            Loading ads...
          </div>
        ) : ads.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No advertisements found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all"
                >
                  <h4 className="text-lg font-medium text-gray-900 mb-2 truncate">
                    {ad.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Placement:</span> {ad.placement}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`${
                        ad.is_active ? "text-green-600" : "text-red-600"
                      } font-medium`}
                    >
                      {ad.is_active ? "Active" : "Inactive"}
                    </span>
                  </p>
                  {ad.redirect_url && (
                    <p className="text-sm text-gray-600 mb-3 truncate">
                      <span className="font-medium">URL:</span>{" "}
                      <a
                        href={ad.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {ad.redirect_url}
                      </a>
                    </p>
                  )}
                  <div className="space-y-3 mb-4">
                    {ad.desktop_image_url && (
                      <img
                        src={ad.desktop_image_url}
                        alt="Desktop Ad"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    {ad.mobile_image_url && (
                      <img
                        src={ad.mobile_image_url}
                        alt="Mobile Ad"
                        className="w-1/2 h-20 object-cover rounded-md"
                      />
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedAd(ad);
                        setEditMode(true);
                        setShowForm(true);
                      }}
                      className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition-all font-medium"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all font-medium"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ConfigAd;