"use client";

import { useState, useEffect } from "react";
import { Upload, Image, FileText, Trash } from "lucide-react";

const UniversityHeader = ({ formData, setFormData }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [brochureName, setBrochureName] = useState(null);

  // ✅ Ensure existing images are correctly displayed
  useEffect(() => {
    if (formData.logo && typeof formData.logo === "string") {
      setLogoPreview(formData.logo); // ✅ Use existing image URL
    }
    if (formData.cover_photo && typeof formData.cover_photo === "string") {
      setCoverPreview(formData.cover_photo);
    }
    if (formData.brochure && typeof formData.brochure === "string") {
      setBrochureName(formData.brochure.split("/").pop());
    }
  }, [formData.logo, formData.cover_photo, formData.brochure]);

  // ✅ Cleanup Object URLs to prevent memory leaks
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

      // ✅ Generate a preview for images
      if (name === "logo" || name === "cover_photo") {
        const objectURL = URL.createObjectURL(file);
        if (name === "logo") {
          if (logoPreview && typeof logoPreview !== "string") URL.revokeObjectURL(logoPreview); // Cleanup previous
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

      console.log(`📂 File Selected: ${name} -> ${file.name}`);

      // ✅ Save the file object in formData
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle file removal
  const handleRemoveFile = (type) => {
    if (type === "logo") {
      setLogoPreview(null);
      setFormData((prev) => ({ ...prev, logo: null }));
    }
    if (type === "cover_photo") {
      setCoverPreview(null);
      setFormData((prev) => ({ ...prev, cover_photo: null }));
    }
    if (type === "brochure") {
      setBrochureName(null);
      setFormData((prev) => ({ ...prev, brochure: null }));
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

      {/* Brochure Upload */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Brochure (PDF)</label>
        <div className="flex items-center gap-4">
          {brochureName && <span className="text-gray-600 text-sm">{brochureName}</span>}
          {brochureName && (
            <button
              onClick={() => handleRemoveFile("brochure")}
              className="bg-red-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-red-600"
            >
              Remove
            </button>
          )}
          <input type="file" name="brochure" accept="application/pdf" onChange={handleFileChange} className="hidden" id="brochure-upload" />
          <label htmlFor="brochure-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Upload Brochure
          </label>
        </div>
      </div>
    </div>
  );
};

export default UniversityHeader;
