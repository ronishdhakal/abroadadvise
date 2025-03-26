"use client";

import { useState, useEffect } from "react";

const DistrictForm = ({ initialData = null, editMode = false, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({ name: initialData.name || "" });
    }
  }, [editMode, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">
        {editMode ? "Edit District" : "Create District"}
      </h3>

      <input
        type="text"
        name="name"
        placeholder="District Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full mb-2"
      />

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        {editMode ? "Update District" : "Create District"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
      >
        Cancel
      </button>
    </form>
  );
};

export default DistrictForm;
