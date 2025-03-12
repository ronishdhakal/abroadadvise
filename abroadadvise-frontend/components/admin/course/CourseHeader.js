"use client";

import { useState, useEffect } from "react";
import { Upload, Image, Trash } from "lucide-react";

const CourseHeader = ({ formData, setFormData }) => {
  const [iconPreview, setIconPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // ✅ Ensure existing images are correctly displayed
  useEffect(() => {
    if (formData.icon && typeof formData.icon === "string") {
      setIconPreview(formData.icon); // ✅ Use existing image URL
    }
    if (formData.cover_image && typeof formData.cover_image === "string") {
      setCoverPreview(formData.cover_image);
    }
  }, [formData.icon, formData.cover_image]);

  // ✅ Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (iconPreview && typeof iconPreview !== "string") URL.revokeObjectURL(iconPreview);
      if (coverPreview && typeof coverPreview !== "string") URL.revokeObjectURL(coverPreview);
    };
  }, [iconPreview, coverPreview]);

  // ✅ Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];

      // ✅ Generate a preview for images
      const objectURL = URL.createObjectURL(file);
      if (name === "icon") {
        setIconPreview(objectURL);
      }
      if (name === "cover_image") {
        setCoverPreview(objectURL);
      }

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
    if (type === "icon") {
      setIconPreview(null);
      setFormData((prev) => ({ ...prev, icon: null }));
    }
    if (type === "cover_image") {
      setCoverPreview(null);
      setFormData((prev) => ({ ...prev, cover_image: null }));
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Header</h2>

      {/* ✅ Course Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Course Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Course Name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* ✅ Course Abbreviation */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Abbreviation</label>
        <input
          type="text"
          name="abbreviation"
          placeholder="e.g. BSc CSIT"
          value={formData.abbreviation || ""}
          onChange={handleInputChange}
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* ✅ Course Duration */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Duration *</label>
        <input
          type="text"
          name="duration"
          placeholder="Enter Duration (e.g. 4 Years)"
          value={formData.duration || ""}
          onChange={handleInputChange}
          required
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* ✅ Course Level */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Level *</label>
        <input
          type="text"
          name="level"
          placeholder="Enter Course Level (e.g. Bachelor's, Master's)"
          value={formData.level || ""}
          onChange={handleInputChange}
          required
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* ✅ Course Fee */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Fee *</label>
        <input
          type="text"
          name="fee"
          placeholder="Enter Fee (e.g. $10,000)"
          value={formData.fee || ""}
          onChange={handleInputChange}
          required
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* ✅ Course Icon Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Course Icon</label>
        <div className="flex items-center gap-4">
          {iconPreview && (
            <div className="relative">
              <img src={iconPreview} alt="Icon Preview" className="w-16 h-16 object-contain border rounded-lg" />
              <button
                onClick={() => handleRemoveFile("icon")}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
          <input type="file" name="icon" accept="image/*" onChange={handleFileChange} className="hidden" id="icon-upload" />
          <label htmlFor="icon-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Icon
          </label>
        </div>
      </div>

      {/* ✅ Course Cover Photo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Cover Photo</label>
        <div className="flex items-center gap-4">
          {coverPreview && (
            <div className="relative">
              <img src={coverPreview} alt="Cover Preview" className="w-24 h-16 object-cover border rounded-lg" />
              <button
                onClick={() => handleRemoveFile("cover_image")}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
          <input type="file" name="cover_image" accept="image/*" onChange={handleFileChange} className="hidden" id="cover-upload" />
          <label htmlFor="cover-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Image className="w-5 h-5 mr-2" />
            Upload Cover
          </label>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
