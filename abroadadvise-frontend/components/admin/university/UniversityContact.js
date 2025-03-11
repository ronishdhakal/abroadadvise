"use client";

import { useState } from "react";
import { Globe, Mail, Phone, Landmark, CheckCircle, MapPin, Edit3 } from "lucide-react"; // ✅ Added icons for Address, Country, and Slug

const UniversityContact = ({ formData, setFormData }) => {
  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle Verification Toggle
  const handleVerificationToggle = () => {
    setFormData((prev) => ({
      ...prev,
      verified: !prev.verified, // ✅ Toggle verification status
    }));
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

      {/* Slug (Manual Entry) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Slug (Auto-generated if left blank)</label>
        <div className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            name="slug"
            placeholder="Enter slug manually or leave empty"
            value={formData.slug || ""}
            onChange={handleInputChange}
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
      {/* University Type (Added "required" validation) */}
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


      {/* Verification Toggle */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="verified"
          checked={formData.verified || false}
          onChange={handleVerificationToggle}
          className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="ml-2 text-gray-700 font-medium">Verified Institution</span>
      </div>

      {/* Verification Badge Display */}
      {formData.verified && (
        <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-semibold text-sm">Verified Institution</span>
        </div>
      )}
    </div>
  );
};

export default UniversityContact;
