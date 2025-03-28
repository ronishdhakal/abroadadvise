"use client";

import { useState, useEffect } from "react";
import { Upload, Image, FileText, Trash } from "lucide-react";
import { updateUniversityDashboard } from "@/utils/api";

const UniversityHeader = ({ formData, setFormData }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [brochureName, setBrochureName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!formData) {
    return (
      <div className="p-6 bg-white shadow-md rounded-xl text-center text-gray-500 italic">
        Loading university data...
      </div>
    );
  }

  useEffect(() => {
    if (formData.logo && typeof formData.logo === "string") setLogoPreview(formData.logo);
    if (formData.cover_photo && typeof formData.cover_photo === "string") setCoverPreview(formData.cover_photo);
    if (formData.brochure && typeof formData.brochure === "string")
      setBrochureName(formData.brochure.split("/").pop());
  }, [formData]);

  useEffect(() => {
    return () => {
      if (logoPreview && typeof logoPreview !== "string") URL.revokeObjectURL(logoPreview);
      if (coverPreview && typeof coverPreview !== "string") URL.revokeObjectURL(coverPreview);
    };
  }, [logoPreview, coverPreview]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      if (name === "logo" || name === "cover_photo") {
        const objectURL = URL.createObjectURL(file);
        if (name === "logo") {
          if (logoPreview && typeof logoPreview !== "string") URL.revokeObjectURL(logoPreview);
          setLogoPreview(objectURL);
        }
        if (name === "cover_photo") {
          if (coverPreview && typeof coverPreview !== "string") URL.revokeObjectURL(coverPreview);
          setCoverPreview(objectURL);
        }
      }
      if (name === "brochure") setBrochureName(file.name);
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveFile = (type) => {
    if (type === "logo") setLogoPreview(null);
    if (type === "cover_photo") setCoverPreview(null);
    if (type === "brochure") setBrochureName(null);
    setFormData((prev) => ({ ...prev, [type]: null }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updateData = new FormData();
      if (formData.name) updateData.append("name", formData.name);
      if (formData.logo) updateData.append("logo", formData.logo);
      if (formData.cover_photo) updateData.append("cover_photo", formData.cover_photo);
      if (formData.brochure) updateData.append("brochure", formData.brochure);

      await updateUniversityDashboard(updateData);
      setSuccessMessage("University header updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update header");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-2xl w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">University Header</h2>

      {/* Name Input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">University Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter University Name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5] transition-all"
        />
      </div>

      {/* Logo Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">University Logo</label>
        <div className="flex items-center gap-4 flex-wrap">
          {logoPreview && (
            <div className="relative group">
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="w-20 h-20 object-contain border border-gray-200 rounded-lg shadow-sm"
              />
              <button
                onClick={() => handleRemoveFile("logo")}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="cursor-pointer bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white px-5 py-2 rounded-lg flex items-center transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Logo
          </label>
        </div>
      </div>

      {/* Cover Photo Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Cover Photo</label>
        <div className="flex items-center gap-4 flex-wrap">
          {coverPreview && (
            <div className="relative group">
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-32 h-20 object-cover border border-gray-200 rounded-lg shadow-sm"
              />
              <button
                onClick={() => handleRemoveFile("cover_photo")}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            type="file"
            name="cover_photo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="cover-upload"
          />
          <label
            htmlFor="cover-upload"
            className="cursor-pointer bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white px-5 py-2 rounded-lg flex items-center transition-colors"
          >
            <Image className="w-5 h-5 mr-2" />
            Upload Cover
          </label>
        </div>
      </div>

      {/* Brochure Upload */}
      <div className="mb-8">
        <label className="block text-gray-700 font-medium mb-2">Brochure (PDF)</label>
        <div className="flex items-center gap-4 flex-wrap">
          {brochureName && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm truncate max-w-xs">{brochureName}</span>
              <button
                onClick={() => handleRemoveFile("brochure")}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm transition-colors"
              >
                Remove
              </button>
            </div>
          )}
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
            className="cursor-pointer bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white px-5 py-2 rounded-lg flex items-center transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Upload Brochure
          </label>
        </div>
      </div>

      {/* Update Button */}
      <div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Updating..." : "Update University Header"}
        </button>

        {successMessage && (
          <div className="mt-4 text-green-600 text-sm font-medium text-center">{successMessage}</div>
        )}
        {error && (
          <div className="mt-4 text-red-600 text-sm font-medium text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default UniversityHeader;
