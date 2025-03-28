"use client";

import { useState } from "react";
import { Globe2, Mail, PhoneCall, MapPin, Building2 } from "lucide-react";
import { updateUniversityDashboard } from "@/utils/api";

const UniversityContact = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!formData) {
    return (
      <div className="p-8 bg-white shadow-md rounded-2xl text-center text-gray-500 italic">
        Loading university contact details...
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
    <div className="p-8 bg-white shadow-lg rounded-2xl w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        University Contact Information
      </h2>

      {/* Country */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Country *</label>
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-[#4c9bd5]" />
          <input
            type="text"
            name="country"
            placeholder="Enter country"
            value={formData.country || ""}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5] transition-all"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Address *</label>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-[#4c9bd5]" />
          <input
            type="text"
            name="address"
            placeholder="Enter full address"
            value={formData.address || ""}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5] transition-all"
          />
        </div>
      </div>

      {/* Website */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Website</label>
        <div className="flex items-center gap-3">
          <Globe2 className="h-5 w-5 text-[#4c9bd5]" />
          <input
            type="url"
            name="website"
            placeholder="https://youruniversity.com"
            value={formData.website || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5] transition-all"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-[#4c9bd5]" />
          <input
            type="email"
            name="email"
            placeholder="contact@university.com"
            value={formData.email || ""}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5] transition-all"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Phone</label>
        <div className="flex items-center gap-3">
          <PhoneCall className="h-5 w-5 text-[#4c9bd5]" />
          <input
            type="text"
            name="phone"
            placeholder="+1 234 567 890"
            value={formData.phone || ""}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5] transition-all"
          />
        </div>
      </div>

      {/* University Type */}
      <div className="mb-8">
        <label className="block text-gray-700 font-medium mb-2">University Type *</label>
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-[#4c9bd5]" />
          <select
            name="type"
            value={formData.type || ""}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5] transition-all"
          >
            <option value="">Select Type</option>
            <option value="private">Private University</option>
            <option value="community">Community University</option>
          </select>
        </div>
      </div>

      {/* Update Button */}
      <div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Updating..." : "Update Contact"}
        </button>

        {/* Success & Error Messages */}
        {successMessage && (
          <div className="mt-4 text-green-600 text-sm font-medium text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityContact;
