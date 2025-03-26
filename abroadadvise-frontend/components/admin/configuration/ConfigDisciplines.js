"use client";

import { useEffect, useState } from "react";
import {
  fetchDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
} from "@/utils/api";
import DisciplineForm from "./DisciplineForm";
import Pagination from "@/components/Pagination";

const ConfigDisciplines = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDisciplines();
  }, [page, search]);

  const loadDisciplines = async () => {
    setLoading(true);
    try {
      const response = await fetchDisciplines(page, search);
      setDisciplines(response?.results || []);
      setTotalPages(Math.ceil((response?.count || 0) / 10));
    } catch (err) {
      console.error("❌ Failed to load disciplines:", err);
      setError("Failed to load disciplines.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    try {
      if (editMode && selectedDiscipline) {
        await updateDiscipline(selectedDiscipline.id, formData);
      } else {
        await createDiscipline(formData);
      }
      setShowForm(false);
      setEditMode(false);
      setSelectedDiscipline(null);
      loadDisciplines();
    } catch (err) {
      console.error("❌ Failed to save discipline:", err);
      setError("Failed to save discipline.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this discipline?")) return;
    setLoading(true);
    try {
      await deleteDiscipline(id);
      loadDisciplines();
    } catch (err) {
      console.error("❌ Failed to delete discipline:", err);
      setError("Failed to delete discipline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Disciplines</h2>

      {/* ✅ Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search disciplines..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1 when searching
          }}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <button
          onClick={() => loadDisciplines()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <button
        onClick={() => {
          setShowForm(true);
          setEditMode(false);
          setSelectedDiscipline(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add New Discipline
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {showForm && (
        <DisciplineForm
          initialData={selectedDiscipline}
          editMode={editMode}
          onCancel={() => {
            setShowForm(false);
            setSelectedDiscipline(null);
            setEditMode(false);
          }}
          onSubmit={handleCreateOrUpdate}
        />
      )}

      {loading ? (
        <p>Loading disciplines...</p>
      ) : disciplines.length === 0 ? (
        <p>No disciplines found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {disciplines.map((discipline) => (
              <div key={discipline.id} className="border p-4 rounded shadow">
                <h3 className="font-semibold">{discipline.name}</h3>
                <button
                  onClick={() => {
                    setSelectedDiscipline(discipline);
                    setEditMode(true);
                    setShowForm(true);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mt-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(discipline.id)}
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

export default ConfigDisciplines;
