"use client";

import { useEffect } from "react";

const EventHeader = ({ formData, setFormData }) => {
  // ✅ Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle File Uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Event Details</h2>

      {/* ✅ Event Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Event Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Enter event name"
          required
        />
      </div>

      {/* ✅ Slug (Auto-generated but editable) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Slug:</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Auto-generated slug"
          required
        />
      </div>

      {/* ✅ Event Type (Dropdown) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Event Type:</label>
        <select
          name="event_type"
          value={formData.event_type}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        >
          <option value="">Select Type</option>
          <option value="physical">Physical</option>
          <option value="online">Online</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      {/* ✅ Event Date */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Event Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      {/* ✅ Event Time */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Event Time:</label>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Enter event time (e.g., 10:00 AM - 2:00 PM)"
        />
      </div>

      {/* ✅ Event Duration */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Event Duration:</label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Enter duration (e.g., 4 hours, 2 days)"
        />
      </div>

      {/* ✅ Registration Type (Free/Paid) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Registration Type:</label>
        <select
          name="registration_type"
          value={formData.registration_type}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        >
          <option value="">Select Registration Type</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* ✅ Event Price (Only shown if Paid) */}
      {formData.registration_type === "paid" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Event Price (NPR):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter event price (e.g., 500)"
            min="0"
          />
        </div>
      )}

      {/* ✅ Event Location */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Event Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          placeholder="Enter event location"
        />
      </div>

      {/* ✅ Featured Image Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Featured Image:</label>
        <input
          type="file"
          name="featured_image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
        {formData.featured_image && typeof formData.featured_image === "string" && (
          <img
            src={formData.featured_image}
            alt="Event Featured"
            className="mt-2 w-32 h-20 object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default EventHeader;
