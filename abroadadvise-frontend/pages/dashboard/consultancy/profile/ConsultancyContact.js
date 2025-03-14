"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { Globe, Mail, Phone, Calendar, MapPin, Tag } from "lucide-react";
import { updateConsultancyDashboard } from "@/utils/api";

const ConsultancyContact = ({ formData, setFormData, allDistricts = [] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  // ✅ Set district options when `allDistricts` is available
  useEffect(() => {
    if (allDistricts.length > 0) {
      const formattedOptions = allDistricts.map((district) => ({
        value: district.id,
        label: district.name,
      }));
      setDistrictOptions(formattedOptions);
    }
  }, [allDistricts]);

  // ✅ Prefill selected districts when editing
  useEffect(() => {
    if (formData.districts && Array.isArray(formData.districts) && allDistricts.length > 0) {
      const preselected = allDistricts
        .filter((district) => formData.districts.includes(district.id))
        .map((district) => ({
          value: district.id,
          label: district.name,
        }));

      setSelectedDistricts(preselected);
    }
  }, [formData.districts, allDistricts]);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle district selection
  const handleDistrictChange = (selectedOptions) => {
    setSelectedDistricts(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      districts: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  // ✅ Handle update request (ONLY updates districts & contact info)
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = new FormData();
      ["slug", "address", "website", "email", "phone", "google_map_url", "establishment_date", "moe_certified"].forEach((key) => {
        updateData.append(key, formData[key] || "");
      });
      updateData.append("districts", JSON.stringify(formData.districts || []));

      // ✅ API Call: Only update contact info and districts
      await updateConsultancyDashboard(updateData);

      // ✅ Update local state to reflect changes
      setFormData((prev) => ({
        ...prev,
        districts: formData.districts,
      }));

      setSuccessMessage("Contact information updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update contact information");
    } finally {
      setLoading(false);
    }
  };

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
            placeholder="https://yourconsultancy.com"
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
            required
            className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Districts Covered (Multi-Select Dropdown) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Districts Covered</label>
        <Select
          isMulti
          options={districtOptions}
          value={selectedDistricts} // ✅ Prefilled correctly
          onChange={handleDistrictChange}
          className="w-full"
          placeholder="Search and select districts..."
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Contact Info"}
      </button>

      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default ConsultancyContact;
