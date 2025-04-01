"use client";

import { useEffect, useState } from "react";
import { fetchAds, createAd, updateAd, deleteAd } from "@/utils/api";
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
      setError("Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    try {
      editMode && selectedAd
        ? await updateAd(selectedAd.id, formData)
        : await createAd(formData);
      setShowForm(false);
      setEditMode(false);
      setSelectedAd(null);
      loadAds();
    } catch (err) {
      setError("Failed to save ad");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await deleteAd(id);
      loadAds();
    } catch (err) {
      setError("Failed to delete ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Advertisements</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditMode(false);
            setSelectedAd(null);
          }}
          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
          disabled={loading}
        >
          + New Ad
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form Section */}
      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
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
        </div>
      )}

      {/* Ads List */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : ads.length === 0 ? (
        <p className="text-gray-500">No advertisements found</p>
      ) : (
        <>
          <div className="space-y-4">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-gray-800 font-medium">{ad.title}</h4>
                    <p className="text-sm text-gray-600">
                      Placement: {ad.placement}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={
                          ad.is_active ? "text-green-600" : "text-red-600"
                        }
                      >
                        {ad.is_active ? "Active" : "Inactive"}
                      </span>
                    </p>
                    {ad.redirect_url && (
                      <p className="text-sm text-gray-600 truncate max-w-md">
                        URL:{" "}
                        <a
                          href={ad.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4c9bd5] hover:underline"
                        >
                          {ad.redirect_url}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAd(ad);
                        setEditMode(true);
                        setShowForm(true);
                      }}
                      className="text-[#4c9bd5] hover:underline"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="text-red-500 hover:underline"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-3">
                  {ad.desktop_image_url && (
                    <img
                      src={ad.desktop_image_url}
                      alt="Desktop Ad"
                      className="w-32 h-20 object-cover rounded-md"
                    />
                  )}
                  {ad.mobile_image_url && (
                    <img
                      src={ad.mobile_image_url}
                      alt="Mobile Ad"
                      className="w-16 h-20 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConfigAd;