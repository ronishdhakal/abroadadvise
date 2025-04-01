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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {editMode ? "Edit District" : "New District"}
      </h3>

      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="District Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4c9bd5] transition-colors"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
        >
          {editMode ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DistrictForm;