"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Trash } from "lucide-react";
import { updateUniversityDashboard } from "@/utils/api";

const UniversityOverview = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [brochureName, setBrochureName] = useState(null);

  // ✅ Initialize brochureName only when formData is ready
  useEffect(() => {
    if (formData?.brochure && typeof formData.brochure === "string") {
      setBrochureName(formData.brochure.split("/").pop());
    }
  }, [formData?.brochure]);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle brochure file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrochureName(file.name);
      setFormData((prev) => ({
        ...prev,
        brochure: file,
      }));
    }
  };

  // ✅ Handle brochure removal
  const handleRemoveBrochure = () => {
    setBrochureName(null);
    setFormData((prev) => ({
      ...prev,
      brochure: null,
    }));
  };

  // ✅ Handle update request
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = new FormData();
      updateData.append("tuition_fees", formData.tuition_fees || "");

      if (formData.brochure instanceof File) {
        updateData.append("brochure", formData.brochure);
      }

      await updateUniversityDashboard(updateData);
      setSuccessMessage("University overview updated successfully!");
    } catch (err) {
      console.error("❌ Update Failed:", err);
      setError(err.message || "Failed to update overview.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return <p className="text-gray-500 italic">Loading university data...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">University Overview</h2>

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

      {/* Brochure Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Brochure (PDF)</label>
        <input
          type="file"
          name="brochure"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="brochure-upload"
        />
        <label
          htmlFor="brochure-upload"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Upload className="w-5 h-5 mr-2" /> Upload Brochure
        </label>

        {brochureName && (
          <div className="flex items-center mt-2">
            <span className="text-gray-600 text-sm mr-2">{brochureName}</span>
            <button onClick={handleRemoveBrochure} className="text-red-600 hover:text-red-800">
              <Trash className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Overview"}
      </button>

      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default UniversityOverview;
