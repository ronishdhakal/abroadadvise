"use client";

import { useState, useEffect } from "react";
import { Upload, Image, FileText, Trash } from "lucide-react";

const CollegeHeader = ({ formData, setFormData }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [brochureName, setBrochureName] = useState(null);

  useEffect(() => {
    if (formData.logo && typeof formData.logo === "string") setLogoPreview(formData.logo);
    if (formData.cover_photo && typeof formData.cover_photo === "string") setCoverPreview(formData.cover_photo);
    if (formData.brochure && typeof formData.brochure === "string") setBrochureName(formData.brochure.split("/").pop());
  }, [formData.logo, formData.cover_photo, formData.brochure]);

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

      if (name === "logo") {
        const objectURL = URL.createObjectURL(file);
        if (logoPreview && typeof logoPreview !== "string") URL.revokeObjectURL(logoPreview);
        setLogoPreview(objectURL);
      }
      if (name === "cover_photo") {
        const objectURL = URL.createObjectURL(file);
        if (coverPreview && typeof coverPreview !== "string") URL.revokeObjectURL(coverPreview);
        setCoverPreview(objectURL);
      }
      if (name === "brochure") {
        setBrochureName(file.name);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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
      <h2 className="text-xl font-bold text-gray-800 mb-4">College Header</h2>

      {/* College Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">College Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter College Name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Verified Checkbox */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="verified"
          name="verified"
          checked={formData.verified || false}
          onChange={handleInputChange}
          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border border-gray-300 rounded"
        />
        <label htmlFor="verified" className="text-gray-700 font-medium">
          Verified
        </label>
      </div>

      {/* Logo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">College Logo</label>
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

export default CollegeHeader;
