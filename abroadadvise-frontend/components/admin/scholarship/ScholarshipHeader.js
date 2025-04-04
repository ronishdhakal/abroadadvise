"use client";

import { useEffect, useState } from "react";
import { Upload, CalendarDays, BookOpen, Trash } from "lucide-react";
import { fetchDestinationsDropdown } from "@/utils/api"; // Updated to use fetchDestinationsDropdown
import Select from "react-select";

const LEVEL_CHOICES = [
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
  { value: "diploma", label: "Diploma" },
];

const ScholarshipHeader = ({ formData, setFormData }) => {
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [featuredPreview, setFeaturedPreview] = useState(null);

  // ✅ Fetch Destinations (exact same as CourseInfo)
  useEffect(() => {
    setLoadingDestinations(true);
    fetchDestinationsDropdown()
      .then((data) => setDestinations(data || []))
      .catch((error) => console.error("Error fetching destinations:", error))
      .finally(() => setLoadingDestinations(false));
  }, []);

  useEffect(() => {
    if (formData.featured_image && typeof formData.featured_image === "string") {
      setFeaturedPreview(formData.featured_image);
    }
  }, [formData.featured_image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, featured_image: file }));
      setFeaturedPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, featured_image: null }));
    setFeaturedPreview(null);
  };

  // ✅ Handle Destination Change (exact same as CourseInfo)
  const handleDestinationChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      destination: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleLevelChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      study_level: selectedOption?.value || null,
    }));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Scholarship Info</h2>

      {/* Title */}
      <div>
        <label className="font-medium text-gray-700 mb-1 block">Scholarship Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          placeholder="Enter scholarship title"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="font-medium text-gray-700 mb-1 block">Slug (optional)</label>
        <input
          type="text"
          name="slug"
          value={formData.slug || ""}
          onChange={handleInputChange}
          placeholder="Auto-generated if left blank"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* By (Text) */}
      <div>
        <label className="font-medium text-gray-700 mb-1 block">By (Institution Name)</label>
        <input
          type="text"
          name="by"
          value={formData.by || ""}
          onChange={handleInputChange}
          placeholder="e.g. Harvard University"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* ✅ Destination (exact same as CourseInfo) */}
      <div>
        <h3 className="text-gray-700 font-medium mb-1">Study Destination</h3>
        <Select
          isLoading={loadingDestinations}
          options={destinations.map((dest) => ({
            value: dest.id,
            label: dest.title,
          }))}
          value={
            formData.destination
              ? {
                  value: formData.destination,
                  label: destinations.find((d) => d.id === formData.destination)?.title,
                }
              : null
          }
          onChange={handleDestinationChange}
          className="w-full"
          placeholder="Select study destination..."
          isClearable
        />
        {formData.destination && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
              {destinations.find((d) => d.id === formData.destination)?.title}
            </span>
          </div>
        )}
      </div>

      {/* Study Level */}
      <div>
        <label className="font-medium text-gray-700 mb-1 block">Study Level</label>
        <Select
          options={LEVEL_CHOICES}
          value={LEVEL_CHOICES.find((opt) => opt.value === formData.study_level) || null}
          onChange={handleLevelChange}
          placeholder="Select level"
        />
      </div>

      {/* Published Date */}
      <div>
        <label className="font-medium text-gray-700 mb-1 block">Published Date</label>
        <input
          type="date"
          name="published_date"
          value={formData.published_date || ""}
          onChange={handleDateChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Active Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-gray-700 mb-1 block">Active From</label>
          <input
            type="date"
            name="active_from"
            value={formData.active_from || ""}
            onChange={handleDateChange}
            className="w-full border rounded-lg p-3"
          />
        </div>
        <div>
          <label className="font-medium text-gray-700 mb-1 block">Active To</label>
          <input
            type="date"
            name="active_to"
            value={formData.active_to || ""}
            onChange={handleDateChange}
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>

      {/* Featured Image Upload */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Featured Image</label>
        <div className="flex items-center gap-4">
          {featuredPreview && (
            <div className="relative">
              <img src={featuredPreview} alt="Featured Preview" className="w-24 h-16 object-cover border rounded-lg" />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            type="file"
            name="featured_image"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="featured-upload"
          />
          <label
            htmlFor="featured-upload"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Image
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipHeader;