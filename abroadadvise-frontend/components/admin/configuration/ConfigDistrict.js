"use client";

import { useEffect, useState } from "react";
import {
  fetchDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "@/utils/api";
import DistrictForm from "./DistrictForm";
import Pagination from "@/components/Pagination";

const ConfigDistrict = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDistricts();
  }, [page, search]);

  const loadDistricts = async () => {
    setLoading(true);
    try {
      const response = await fetchDistricts(page, search);
      setDistricts(response?.results || []);
      setTotalPages(Math.ceil((response?.count || 0) / 10));
    } catch (err) {
      console.error("❌ Failed to load districts:", err);
      setError("Failed to load districts.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    try {
      if (editMode && selectedDistrict) {
        await updateDistrict(selectedDistrict.id, formData);
      } else {
        await createDistrict(formData);
      }
      setShowForm(false);
      setEditMode(false);
      setSelectedDistrict(null);
      loadDistricts();
    } catch (err) {
      console.error("❌ Failed to save district:", err);
      setError("Failed to save district.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this district?")) return;
    setLoading(true);
    try {
      await deleteDistrict(id);
      loadDistricts();
    } catch (err) {
      console.error("❌ Failed to delete district:", err);
      setError("Failed to delete district.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Districts</h2>

      {/* ✅ Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search districts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page when new search starts
          }}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <button
          onClick={() => loadDistricts()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <button
        onClick={() => {
          setShowForm(true);
          setEditMode(false);
          setSelectedDistrict(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add New District
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {showForm && (
        <DistrictForm
          initialData={selectedDistrict}
          editMode={editMode}
          onCancel={() => {
            setShowForm(false);
            setSelectedDistrict(null);
            setEditMode(false);
          }}
          onSubmit={handleCreateOrUpdate}
        />
      )}

      {loading ? (
        <p>Loading districts...</p>
      ) : districts.length === 0 ? (
        <p>No districts found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {districts.map((district) => (
              <div key={district.id} className="border p-4 rounded shadow">
                <h3 className="font-semibold">{district.name}</h3>
                <button
                  onClick={() => {
                    setSelectedDistrict(district);
                    setEditMode(true);
                    setShowForm(true);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mt-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(district.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded mt-2 ml-2"
                >
                  Delete
                </button>
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

export default ConfigDistrict;
