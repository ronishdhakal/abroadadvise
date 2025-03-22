"use client";

import { useState } from "react";
import { Globe, FileText, Hash } from "lucide-react"; // ✅ Import Hash icon

const UniversityOverview = ({ formData, setFormData }) => {
  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">University Overview</h2>

      {/* University Type & Tuition Fees */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">University Type *</label>
        <select
          name="type"
          value={formData.type || ""}
          onChange={handleInputChange}
          required
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        >
          <option value="">Select Type</option>
          <option value="private">Private University</option>
          <option value="community">Community University</option>
        </select>
      </div>

      {/* Tuition Fees */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Tuition Fees (Per Year)</label>
        <input
          type="text"
          name="tuition_fees"
          placeholder="Enter tuition fees per year"
          value={formData.tuition_fees || ""}
          onChange={handleInputChange}
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* QS World Ranking */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">QS World Ranking</label>
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-gray-500" /> {/* QS Ranking Icon */}
          <input
            type="text"
            name="qs_world_ranking"
            placeholder="Enter QS World Ranking (e.g., 100-150, 200)"
            value={formData.qs_world_ranking || ""}
            onChange={handleInputChange}
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Website */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">University Website</label>
        <input
          type="url"
          name="website"
          placeholder="Enter University Website URL"
          value={formData.website || ""}
          onChange={handleInputChange}
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
        {formData.website && (
          <a
            href={formData.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-blue-600 hover:underline"
          >
            <Globe className="h-4 w-4 mr-1" />
            Visit Website
          </a>
        )}
      </div>

      {/* Brochure Download */}
      {formData.brochure && typeof formData.brochure === "string" && (
        <div className="mt-4">
          <a
            href={formData.brochure}
            download
            className="inline-flex items-center px-4 py-2 text-sm sm:text-base font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Brochure
          </a>
        </div>
      )}
    </div>
  );
};

export default UniversityOverview;
