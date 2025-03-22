"use client";

import { useEffect, useState } from "react";
import { fetchConsultancies, fetchUniversities, fetchDestinations } from "@/utils/api";

const EventOverview = ({ formData, setFormData }) => {
  const [allConsultancies, setAllConsultancies] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  // ✅ Search states
  const [searchConsultancies, setSearchConsultancies] = useState("");
  const [searchUniversities, setSearchUniversities] = useState("");
  const [searchDestinations, setSearchDestinations] = useState("");

  // ✅ Fetch Data on Component Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [consultancies, universities, destinations] = await Promise.all([
          fetchConsultancies(1, searchConsultancies), // Fetch consultancies
          fetchUniversities(1, searchUniversities), // Fetch universities
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
  }, [searchConsultancies, searchUniversities]);

  // ✅ Handle Organizer Type Selection (Now Fixed to Consultancy)
  const handleOrganizerTypeChange = (e) => {
    //const type = e.target.value; // Removed because we always set consultancy
    setFormData((prev) => ({
      ...prev,
      organizer_slug: "", // Reset organizer when type changes
      organizer_type: "consultancy",//type, // Now, always set to consultancy
    }));
  };

  // ✅ Handle Organizer Selection (Use Slug Instead of ID)
  const handleOrganizerChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      organizer_slug: e.target.value || "", // Use slug instead of ID
    }));
  };

  // ✅ Handle Multi-Select Inputs (Destinations, Universities, Consultancies)
  const handleMultiSelect = (slug, field) => {
    setFormData((prev) => {
      const newValues = prev[field].includes(slug)
        ? prev[field].filter((s) => s !== slug)
        : [...prev[field], slug];
      return { ...prev, [field]: newValues };
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Event Organizer & Destinations</h2>

      {/* ✅ Organizer Type Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Organizer Type:</label>
        <select
          name="organizer_type"
          value={"consultancy"} // Now always is consultancy
          onChange={handleOrganizerTypeChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="consultancy">Consultancy</option>
          {/*<option value="university">University</option> - Removed University option */}
        </select>
      </div>

      {/* ✅ Organizer Selection (Using Slug) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Organizer:</label>
        {/* Search Field for Organizer */}
        <input
          type="text"
          placeholder={`Search Consultancies`}
          value={searchConsultancies}
          onChange={(e) => setSearchConsultancies(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
        />
        <select
          name="organizer_slug"
          value={formData.organizer_slug || ""}
          onChange={handleOrganizerChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="">Select Organizer</option>
          {allConsultancies.map((org) => (
            <option key={org.slug} value={org.slug}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Select Targeted Destinations (Checkbox List) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Targeted Destinations:</label>
        {/* Search Field for Destinations */}
        <input
          type="text"
          placeholder="Search Destinations"
          value={searchDestinations}
          onChange={(e) => setSearchDestinations(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {allDestinations
            .filter((destination) => destination.title.toLowerCase().includes(searchDestinations.toLowerCase()))
            .map((destination) => (
              <label key={destination.slug} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={destination.slug}
                  checked={formData.targeted_destinations.includes(destination.slug)}
                  onChange={() => handleMultiSelect(destination.slug, "targeted_destinations")}
                  className="text-green-500 focus:ring-green-500"
                />
                <span>{destination.title}</span>
              </label>
            ))}
        </div>
      </div>

      {/* ✅ Select Participating Universities (Checkbox List) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Participating Universities:</label>
        {/* Search Field for Universities */}
        <input
          type="text"
          placeholder="Search Universities"
          value={searchUniversities}
          onChange={(e) => setSearchUniversities(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {allUniversities
            .filter((university) => university.name.toLowerCase().includes(searchUniversities.toLowerCase()))
            .map((university) => (
              <label key={university.slug} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={university.slug}
                  checked={formData.related_universities.includes(university.slug)}
                  onChange={() => handleMultiSelect(university.slug, "related_universities")}
                  className="text-green-500 focus:ring-green-500"
                />
                <span>{university.name}</span>
              </label>
            ))}
        </div>
      </div>

      {/* ✅ Select Related Consultancies (Checkbox List) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Related Consultancies:</label>
        {/* Search Field for Consultancies */}
        <input
          type="text"
          placeholder="Search Consultancies"
          value={searchConsultancies}
          onChange={(e) => setSearchConsultancies(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {allConsultancies
            .filter((consultancy) => consultancy.name.toLowerCase().includes(searchConsultancies.toLowerCase()))
            .map((consultancy) => (
              <label key={consultancy.slug} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={consultancy.slug}
                  checked={formData.related_consultancies.includes(consultancy.slug)}
                  onChange={() => handleMultiSelect(consultancy.slug, "related_consultancies")}
                  className="text-green-500 focus:ring-green-500"
                />
                <span>{consultancy.name}</span>
              </label>
            ))}
        </div>
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
