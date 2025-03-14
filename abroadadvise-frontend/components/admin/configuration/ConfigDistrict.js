"use client";

import { useEffect, useState } from "react";
import {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "@/utils/api";

const ConfigDistrict = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  // ✅ Fetch Districts
  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    setLoading(true);
    try {
      const response = await getDistricts();
      setDistricts(response.data);
    } catch (err) {
      console.error("❌ Failed to load districts:", err);
      setError("Failed to load districts.");
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

  // ✅ Handle Create / Update District
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        await updateDistrict(selectedDistrict.id, formData);
      } else {
        await createDistrict(formData);
      }

      setShowForm(false);
      setFormData({ name: "" });
      setEditMode(false);
      loadDistricts();
    } catch (err) {
      console.error("❌ Failed to save district:", err);
      setError("Failed to save district.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Edit District
  const handleEdit = (district) => {
    setSelectedDistrict(district);
    setFormData({
      name: district.name,
    });
    setEditMode(true);
    setShowForm(true);
  };

  // ✅ Handle Delete District
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

      <button
        onClick={() => {
          setShowForm(true);
          setEditMode(false);
          setFormData({ name: "" });
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add New District
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ District Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {editMode ? "Edit District" : "Create District"}
          </h3>

          <input
            type="text"
            name="name"
            placeholder="District Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="border p-2 rounded w-full mb-2"
          />

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
            {editMode ? "Update District" : "Create District"}
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

      {/* ✅ List Districts */}
      {loading ? (
        <p>Loading districts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {districts.map((district) => (
            <div key={district.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{district.name}</h3>
              <button onClick={() => handleEdit(district)} className="bg-yellow-500 text-white px-2 py-1 rounded mt-2">
                Edit
              </button>
              <button onClick={() => handleDelete(district.id)} className="bg-red-500 text-white px-2 py-1 rounded mt-2 ml-2">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigDistrict;
