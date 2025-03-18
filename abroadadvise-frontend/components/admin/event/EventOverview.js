"use client";

import { useEffect, useState } from "react";
import { fetchConsultancies, fetchUniversities, fetchDestinations } from "@/utils/api";

const EventOverview = ({ formData, setFormData }) => {
  const [allConsultancies, setAllConsultancies] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);

  // ✅ Fetch Data on Component Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [consultancies, universities, destinations] = await Promise.all([
          fetchConsultancies(1, ""), // Fetch consultancies
          fetchUniversities(1, ""), // Fetch universities
          fetchDestinations(), // Fetch destinations
        ]);

        setAllConsultancies(consultancies.results || []);
        setAllUniversities(universities.results || []);
        setAllDestinations(destinations.results || []);
      } catch (error) {
        console.error("❌ Error fetching event-related data:", error);
      }
    };
    loadData();
  }, []);

  // ✅ Handle Organizer Type Selection
  const handleOrganizerTypeChange = (e) => {
    const type = e.target.value;
    setFormData((prev) => ({
      ...prev,
      organizer_slug: "", // Reset organizer when type changes
      organizer_type: type,
    }));
  };

  // ✅ Handle Organizer Selection (Use Slug Instead of ID)
  const handleOrganizerChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      organizer_slug: e.target.value || "", // Use slug instead of ID
    }));
  };

  // ✅ Handle Multi-Select Inputs (Destinations, Universities)
  const handleMultiSelect = (e, field) => {
    const selectedValues = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({
      ...prev,
      [field]: selectedValues, // Store slugs instead of IDs
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Event Organizer & Destinations</h2>

      {/* ✅ Organizer Type Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Organizer Type:</label>
        <select
          name="organizer_type"
          value={formData.organizer_type}
          onChange={handleOrganizerTypeChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="consultancy">Consultancy</option>
          <option value="university">University</option>
        </select>
      </div>

      {/* ✅ Organizer Selection (Using Slug) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Organizer:</label>
        <select
          name="organizer_slug"
          value={formData.organizer_slug || ""}
          onChange={handleOrganizerChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="">Select Organizer</option>
          {(formData.organizer_type === "consultancy" ? allConsultancies : allUniversities).map((org) => (
            <option key={org.slug} value={org.slug}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Select Targeted Destinations (Multi-Select Using Slug) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Targeted Destinations:</label>
        <select
          multiple
          name="targeted_destinations"
          value={formData.targeted_destinations || []}
          onChange={(e) => handleMultiSelect(e, "targeted_destinations")}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          {allDestinations.map((destination) => (
            <option key={destination.slug} value={destination.slug}>
              {destination.title}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Select Participating Universities (Multi-Select Using Slug) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Participating Universities:</label>
        <select
          multiple
          name="related_universities"
          value={formData.related_universities || []}
          onChange={(e) => handleMultiSelect(e, "related_universities")}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          {allUniversities.map((university) => (
            <option key={university.slug} value={university.slug}>
              {university.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Select Related Consultancies (Multi-Select Using Slug) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Related Consultancies:</label>
        <select
          multiple
          name="related_consultancies"
          value={formData.related_consultancies || []}
          onChange={(e) => handleMultiSelect(e, "related_consultancies")}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          {allConsultancies.map((consultancy) => (
            <option key={consultancy.slug} value={consultancy.slug}>
              {consultancy.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Debugging - Show Selected Data in Console */}
      <button
        onClick={() => console.log("📌 Updated formData:", formData)}
        className="bg-gray-200 px-4 py-2 rounded-lg mt-4"
      >
        Debug Selected Data
      </button>
    </div>
  );
};

export default EventOverview;
