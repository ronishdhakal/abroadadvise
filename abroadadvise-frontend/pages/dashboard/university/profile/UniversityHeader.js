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

  // ✅ Early return to prevent crash on undefined formData
  if (!formData) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl text-center text-gray-500 italic">
        Loading university data...
      </div>
    );
  }

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
      if (name === "brochure") {
        setBrochureName(file.name);
      }
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
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">University Header</h2>

      {/* Name Input */}
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

      {/* Rest of the UI stays the same (Logo, Cover, Brochure Uploads + Update Button) */}
      {/* ... */}
    </div>
  );
};

export default UniversityHeader;
