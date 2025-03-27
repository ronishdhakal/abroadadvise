"use client";

import { useState } from "react";
import { Globe, Mail, Phone, Landmark, MapPin } from "lucide-react";
import { updateUniversityDashboard } from "@/utils/api";

const UniversityContact = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!formData) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <p className="text-gray-500 italic">Loading university contact details...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = new FormData();
      updateData.append("country", formData.country || "");
      updateData.append("address", formData.address || "");
      updateData.append("website", formData.website || "");
      updateData.append("email", formData.email || "");
      updateData.append("phone", formData.phone || "");
      updateData.append("type", formData.type || "");

      await updateUniversityDashboard(updateData);
      setSuccessMessage("University contact details updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update contact details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">University Contact Information</h2>

      {/* Country */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Country *</label>
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            name="country"
            placeholder="Enter country"
            value={formData.country || ""}
            onChange={handleInputChange}
            required
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Address *</label>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            name="address"
            placeholder="Enter full address"
            value={formData.address || ""}
            onChange={handleInputChange}
            required
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Website */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Website</label>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-500" />
          <input
            type="url"
            name="website"
            placeholder="https://youruniversity.com"
            value={formData.website || ""}
            onChange={handleInputChange}
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-500" />
          <input
            type="email"
            name="email"
            placeholder="contact@university.com"
            value={formData.email || ""}
            onChange={handleInputChange}
            required
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Phone</label>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            name="phone"
            placeholder="+1 234 567 890"
            value={formData.phone || ""}
            onChange={handleInputChange}
            required
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* University Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">University Type *</label>
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-gray-500" />
          <select
            name="type"
            value={formData.type || ""}
            onChange={handleInputChange}
            required
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          >
            <option value="">Select Type</option>
            <option value="private">Private University</option>
            <option value="community">Community University</option>
          </select>
        </div>
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Contact"}
      </button>

      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default UniversityContact;
