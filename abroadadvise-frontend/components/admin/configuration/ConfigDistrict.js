"use client";

import { useEffect, useState } from "react";
import { fetchDistricts, createDistrict, updateDistrict, deleteDistrict } from "@/utils/api";
import DistrictForm from "./DistrictForm";
import Pagination from "@/components/Pagination";

const ConfigDistrict = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      setError("Failed to load districts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    try {
      editMode && selectedDistrict 
        ? await updateDistrict(selectedDistrict.id, formData)
        : await createDistrict(formData);
      setShowForm(false);
      setEditMode(false);
      setSelectedDistrict(null);
      loadDistricts();
    } catch (err) {
      setError("Failed to save district");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await deleteDistrict(id);
      loadDistricts();
    } catch (err) {
      setError("Failed to delete district");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Districts</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditMode(false);
            setSelectedDistrict(null);
          }}
          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
        >
          + New District
        </button>
      </div>

      <input
        type="text"
        placeholder="Search districts..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full p-2 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4c9bd5]"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
        <p className="text-gray-500">Loading...</p>
      ) : districts.length === 0 ? (
        <p className="text-gray-500">No districts found</p>
      ) : (
        <>
          <div className="space-y-4">
            {districts.map((district) => (
              <div 
                key={district.id} 
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-800">{district.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedDistrict(district);
                      setEditMode(true);
                      setShowForm(true);
                    }}
                    className="text-[#4c9bd5] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(district.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
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

export default ConfigDistrict;