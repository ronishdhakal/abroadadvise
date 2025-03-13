"use client";

import { useState, useEffect } from "react";
import { Upload, Image, FileText, Trash } from "lucide-react";

const UniversityHeader = ({ formData, setFormData }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [brochureName, setBrochureName] = useState(null);

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

  // ✅ Revoke previous object URLs to prevent memory leaks
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
      const objectURL = URL.createObjectURL(file);

      if (name === "logo") {
        setLogoPreview(objectURL);
      }
      if (name === "cover_photo") {
        setCoverPreview(objectURL);
      }
      if (name === "brochure") {
        setBrochureName(file.name);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file, // ✅ Store file in formData
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      <h2 className="text-xl font-bold text-gray-800 mb-4">University Header</h2>

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

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Tuition Fee *</label>
        <input
          type="text"
          name="tuition_fees"
          placeholder="Enter Tuition Fee"
          value={formData.tuition_fees || ""}
          onChange={handleInputChange}
          required
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* University Logo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">University Logo</label>
        <input type="file" name="logo" accept="image/*" onChange={handleFileChange} className="hidden" id="logo-upload" />
        <label htmlFor="logo-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Upload className="w-5 h-5 mr-2" /> Upload Logo
        </label>
        {logoPreview && (
          <div className="flex items-center mt-2">
            <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 object-contain border rounded-lg mr-2" />
            <button onClick={() => handleRemoveFile("logo")} className="text-red-600 hover:text-red-800">
              <Trash className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Cover Photo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Cover Photo</label>
        <input type="file" name="cover_photo" accept="image/*" onChange={handleFileChange} className="hidden" id="cover-upload" />
        <label htmlFor="cover-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Image className="w-5 h-5 mr-2" /> Upload Cover
        </label>
        {coverPreview && (
          <div className="flex items-center mt-2">
            <img src={coverPreview} alt="Cover Preview" className="w-24 h-16 object-cover border rounded-lg mr-2" />
            <button onClick={() => handleRemoveFile("cover_photo")} className="text-red-600 hover:text-red-800">
              <Trash className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Brochure Upload */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Brochure (PDF)</label>
        <input type="file" name="brochure" accept="application/pdf" onChange={handleFileChange} className="hidden" id="brochure-upload" />
        <label htmlFor="brochure-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <FileText className="w-5 h-5 mr-2" /> Upload Brochure
        </label>
        {brochureName && (
          <div className="flex items-center mt-2">
            <span className="text-gray-600 text-sm mr-2">{brochureName}</span>
            <button onClick={() => handleRemoveFile("brochure")} className="text-red-600 hover:text-red-800">
              <Trash className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityHeader;
