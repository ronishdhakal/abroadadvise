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

  // ✅ Load existing images if they exist
  useEffect(() => {
    if (formData.logo && typeof formData.logo === "string") {
      setLogoPreview(formData.logo);
    }
    if (formData.cover_photo && typeof formData.cover_photo === "string") {
      setCoverPreview(formData.cover_photo);
    }
    if (formData.brochure && typeof formData.brochure === "string") {
      setBrochureName(formData.brochure.split("/").pop());
    }
  }, [formData]);

  // ✅ Cleanup Object URLs on unmount
  useEffect(() => {
    return () => {
      if (logoPreview && typeof logoPreview !== "string") URL.revokeObjectURL(logoPreview);
      if (coverPreview && typeof coverPreview !== "string") URL.revokeObjectURL(coverPreview);
    };
  }, [logoPreview, coverPreview]);

  // ✅ Handle file uploads
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
      if (name === "brochure") {
        setBrochureName(file.name);
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  // ✅ Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file removal
  const handleRemoveFile = (type) => {
    if (type === "logo") setLogoPreview(null);
    if (type === "cover_photo") setCoverPreview(null);
    if (type === "brochure") setBrochureName(null);
    setFormData((prev) => ({ ...prev, [type]: null }));
  };

  // ✅ Handle update request (ONLY updates header fields)
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = new FormData();

      // ✅ Send only fields that need to be updated
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
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">University Header</h2>

      {/* University Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">University Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter University Name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Logo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">University Logo</label>
        <div className="flex items-center gap-4">
          {logoPreview && (
            <div className="relative">
              <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 object-contain border rounded-lg" />
              <button
                onClick={() => handleRemoveFile("logo")}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
          <input type="file" name="logo" accept="image/*" onChange={handleFileChange} className="hidden" id="logo-upload" />
          <label htmlFor="logo-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Logo
          </label>
        </div>
      </div>

      {/* Cover Photo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Cover Photo</label>
        <div className="flex items-center gap-4">
          {coverPreview && (
            <div className="relative">
              <img src={coverPreview} alt="Cover Preview" className="w-24 h-16 object-cover border rounded-lg" />
              <button
                onClick={() => handleRemoveFile("cover_photo")}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
          <input type="file" name="cover_photo" accept="image/*" onChange={handleFileChange} className="hidden" id="cover-upload" />
          <label htmlFor="cover-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Image className="w-5 h-5 mr-2" />
            Upload Cover
          </label>
        </div>
      </div>

      {/* Update Button */}
      <button onClick={handleUpdate} className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Header"}
      </button>

      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default UniversityHeader;
