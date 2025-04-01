"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { Globe, Mail, Phone, Calendar, MapPin, Tag } from "lucide-react";

const CollegeContact = ({ formData, setFormData, onUpdate, allDistricts = [] }) => {
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  useEffect(() => {
    if (allDistricts.length > 0) {
      const formattedOptions = allDistricts.map((district) => ({
        value: district.id,
        label: district.name,
      }));
      setDistrictOptions(formattedOptions);
    }
  }, [allDistricts]);

  useEffect(() => {
    if (formData?.districts && Array.isArray(formData.districts) && allDistricts.length > 0) {
      const preselected = allDistricts
        .filter((district) => formData.districts.includes(district.id))
        .map((district) => ({
          value: district.id,
          label: district.name,
        }));
      setSelectedDistricts(preselected);
    }
  }, [formData?.districts, allDistricts]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    onUpdate({ [name]: type === "checkbox" ? checked : value });
  };

  const handleDistrictChange = (selectedOptions) => {
    setSelectedDistricts(selectedOptions);
    const updatedDistricts = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFormData((prev) => ({
      ...prev,
      districts: updatedDistricts,
    }));
    onUpdate({ districts: updatedDistricts });
  };

  if (!formData) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <p className="text-gray-500 italic">No college data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">College Contact Information</h2>

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
            placeholder="https://yourcollege.edu"
            value={formData.website || ""}
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
            placeholder="+1 234 567 890"
            value={formData.phone || ""}
            onChange={handleInputChange}
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      
    </div>
  );
};

export default CollegeContact;
