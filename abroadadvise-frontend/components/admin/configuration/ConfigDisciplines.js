"use client";

import { useEffect, useState } from "react";
import {
  getDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
} from "@/utils/api";

const ConfigDisciplines = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  // ✅ Fetch Disciplines
  useEffect(() => {
    loadDisciplines();
  }, []);

  const loadDisciplines = async () => {
    setLoading(true);
    try {
      const response = await getDisciplines();
      setDisciplines(response.data);
    } catch (err) {
      console.error("❌ Failed to load disciplines:", err);
      setError("Failed to load disciplines.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle Create / Update Discipline
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        await updateDiscipline(selectedDiscipline.id, formData);
      } else {
        await createDiscipline(formData);
      }

      setShowForm(false);
      setFormData({ name: "" });
      setEditMode(false);
      loadDisciplines();
    } catch (err) {
      console.error("❌ Failed to save discipline:", err);
      setError("Failed to save discipline.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Edit Discipline
  const handleEdit = (discipline) => {
    setSelectedDiscipline(discipline);
    setFormData({
      name: discipline.name,
    });
    setEditMode(true);
    setShowForm(true);
  };

  // ✅ Handle Delete Discipline
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

      <button
        onClick={() => {
          setShowForm(true);
          setEditMode(false);
          setFormData({ name: "" });
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add New Discipline
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Discipline Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {editMode ? "Edit Discipline" : "Create Discipline"}
          </h3>

          <input
            type="text"
            name="name"
            placeholder="Discipline Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="border p-2 rounded w-full mb-2"
          />

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
            {editMode ? "Update Discipline" : "Create Discipline"}
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Cancel
          </button>
        </form>
      )}

      {/* ✅ List Disciplines */}
      {loading ? (
        <p>Loading disciplines...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disciplines.map((discipline) => (
            <div key={discipline.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{discipline.name}</h3>
              <button onClick={() => handleEdit(discipline)} className="bg-yellow-500 text-white px-2 py-1 rounded mt-2">
                Edit
              </button>
              <button onClick={() => handleDelete(discipline.id)} className="bg-red-500 text-white px-2 py-1 rounded mt-2 ml-2">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigDisciplines;
