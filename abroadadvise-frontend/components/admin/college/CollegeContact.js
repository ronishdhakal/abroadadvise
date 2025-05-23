"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { Globe, Mail, Phone, Calendar, MapPin, Tag } from "lucide-react";

const CollegeContact = ({ formData, setFormData, allDistricts = [] }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDistrictChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      districts: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  useEffect(() => {
    if (formData.districts && Array.isArray(formData.districts)) {
      const preselectedDistricts = allDistricts
        .filter((district) => formData.districts.includes(district.id))
        .map((district) => ({ value: district.id, label: district.name }));
      setFormData((prev) => ({
        ...prev,
        selectedDistricts: preselectedDistricts,
      }));
    }
  }, [formData.districts, allDistricts]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>

      {/* Slug */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Slug</label>
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            name="slug"
            placeholder="auto-generated-slug"
            value={formData.slug || ""}
            onChange={handleInputChange}
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
            placeholder="123 Street, City, Country"
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
            placeholder="https://college.edu"
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
            placeholder="contact@college.edu"
            value={formData.email || ""}
            onChange={handleInputChange}
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
            placeholder="+977 9800000000"
            value={formData.phone || ""}
            onChange={handleInputChange}
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Google Map URL */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Google Map URL</label>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <input
            type="url"
            name="google_map_url"
            placeholder="https://maps.google.com/your-location"
            value={formData.google_map_url || ""}
            onChange={handleInputChange}
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Establishment Date */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Establishment Date</label>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <input
            type="date"
            name="establishment_date"
            value={formData.establishment_date || ""}
            onChange={handleInputChange}
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* MOE Certification */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="moe_certified"
          checked={formData.moe_certified || false}
          onChange={handleInputChange}
          className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="ml-2 text-gray-700 font-medium">
          Certified by Ministry of Education
        </span>
      </div>

      {/* Districts */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Districts Covered</label>
        <Select
          isMulti
          options={allDistricts.map((district) => ({
            value: district.id,
            label: district.name,
          }))}
          value={formData.selectedDistricts || []}
          onChange={handleDistrictChange}
          className="w-full"
          placeholder="Search and select districts..."
        />
      </div>
    </div>
  );
};

export default CollegeContact;
