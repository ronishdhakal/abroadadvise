"use client";

import { useEffect } from "react";

const ExamHeader = ({ formData, setFormData }) => {
  // ✅ Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  // ✅ Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle File Input (For Icon Upload)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Exam Details</h2>

      {/* ✅ Exam Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Exam Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Enter exam name"
          required
        />
      </div>

      {/* ✅ Slug (Auto-generated but editable) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Slug:</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Auto-generated slug"
          required
        />
      </div>

      {/* ✅ Exam Type (Dropdown) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Exam Type:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        >
          <option value="">Select Type</option>
          <option value="english_proficiency">English Proficiency Test</option>
          <option value="standardized_test">Standardized Test</option>
        </select>
      </div>

      {/* ✅ Exam Fee */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Exam Fee (USD):</label>
        <input
          type="number"
          name="exam_fee"
          value={formData.exam_fee}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Enter exam fee"
        />
      </div>

      {/* ✅ Exam Icon Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Exam Icon:</label>
        <input
          type="file"
          name="icon"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
        {/* ✅ Display Existing Icon Preview */}
        {formData.icon && typeof formData.icon === "string" && (
          <div className="mt-2">
            <img src={formData.icon} alt="Exam Icon" className="w-16 h-16 object-contain" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamHeader;
