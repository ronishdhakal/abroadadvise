"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Trash } from "lucide-react";
import { updateUniversityDashboard } from "@/utils/api";

const UniversityOverview = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [brochureName, setBrochureName] = useState(null);

  useEffect(() => {
    if (formData?.brochure && typeof formData.brochure === "string") {
      setBrochureName(formData.brochure.split("/").pop());
    }
  }, [formData?.brochure]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrochureName(file.name);
      setFormData((prev) => ({ ...prev, brochure: file }));
    }
  };

  const handleRemoveBrochure = () => {
    setBrochureName(null);
    setFormData((prev) => ({ ...prev, brochure: null }));
  };

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
      setError(err.message || "Failed to update overview.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return <p className="text-gray-500 italic">Loading university data...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold text-[#4c9bd5] mb-6">University Overview</h2>

      {/* Tuition Fees */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Tuition Fees (Per Year)</label>
        <input
          type="text"
          name="tuition_fees"
          placeholder="Enter tuition fees per year"
          value={formData.tuition_fees || ""}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5]"
        />
      </div>

      {/* Brochure Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Brochure (PDF)</label>
        <div className="flex flex-wrap items-center gap-4">
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
            className="cursor-pointer bg-[#4c9bd5] hover:bg-[#3e8ac1] text-white px-5 py-2 rounded-lg flex items-center transition duration-200"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Brochure
          </label>
          {brochureName && (
            <>
              <span className="text-gray-700 text-sm">{brochureName}</span>
              <button
                onClick={handleRemoveBrochure}
                className="text-red-600 hover:text-red-800 transition"
              >
                <Trash className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-[#4c9bd5] hover:bg-[#3e8ac1] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update Overview"}
      </button>

      {/* Feedback Messages */}
      {successMessage && (
        <p className="text-green-600 mt-4 font-medium">{successMessage}</p>
      )}
      {error && (
        <p className="text-red-600 mt-4 font-medium">{error}</p>
      )}
    </div>
  );
};

export default UniversityOverview;
