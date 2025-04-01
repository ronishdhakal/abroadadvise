"use client";

import { useEffect, useState } from "react";
import { fetchDisciplines, createDiscipline, updateDiscipline, deleteDiscipline } from "@/utils/api";
import DisciplineForm from "./DisciplineForm";
import Pagination from "@/components/Pagination";

const ConfigDisciplines = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      setError("Failed to load disciplines");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    try {
      editMode && selectedDiscipline
        ? await updateDiscipline(selectedDiscipline.id, formData)
        : await createDiscipline(formData);
      setShowForm(false);
      setEditMode(false);
      setSelectedDiscipline(null);
      loadDisciplines();
    } catch (err) {
      setError("Failed to save discipline");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await deleteDiscipline(id);
      loadDisciplines();
    } catch (err) {
      setError("Failed to delete discipline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Disciplines</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditMode(false);
            setSelectedDiscipline(null);
          }}
          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
        >
          + New Discipline
        </button>
      </div>

      <input
        type="text"
        placeholder="Search disciplines..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full p-2 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4c9bd5]"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
        <p className="text-gray-500">Loading...</p>
      ) : disciplines.length === 0 ? (
        <p className="text-gray-500">No disciplines found</p>
      ) : (
        <>
          <div className="space-y-4">
            {disciplines.map((discipline) => (
              <div
                key={discipline.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-800">{discipline.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedDiscipline(discipline);
                      setEditMode(true);
                      setShowForm(true);
                    }}
                    className="text-[#4c9bd5] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(discipline.id)}
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

export default ConfigDisciplines;