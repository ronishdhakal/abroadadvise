"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDestinations } from "@/utils/api";

const ConsultancyStudyDest = ({ formData, setFormData, onUpdate, allDestinations = [] }) => {
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  // ✅ Load destinations from props or fetch if not available
  useEffect(() => {
    if (allDestinations.length > 0) {
      setDestinations(allDestinations); // ✅ Use provided destinations
    } else if (destinations.length === 0) {
      setLoading(true);
      fetchDestinations()
        .then((data) => setDestinations(data.results || []))
        .catch((error) => console.error("Error fetching destinations:", error))
        .finally(() => setLoading(false));
    }
  }, [allDestinations]); // ✅ Runs only when `allDestinations` changes

  // ✅ Prefill selected study destinations (Runs only when necessary)
  useEffect(() => {
    if (
      formData.study_abroad_destinations &&
      Array.isArray(formData.study_abroad_destinations) &&
      destinations.length > 0
    ) {
      const preselected = destinations
        .filter((dest) => formData.study_abroad_destinations.includes(dest.id))
        .map((dest) => ({
          value: dest.id,
          label: dest.title,
        }));

      setSelectedDestinations(preselected);
    }
  }, [formData.study_abroad_destinations, destinations]);

  // ✅ Handle Destination Selection (Only triggers on change)
  const handleDestinationChange = (selectedOptions) => {
    const updatedDestinations = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];

    if (JSON.stringify(updatedDestinations) !== JSON.stringify(formData.study_abroad_destinations)) {
      setSelectedDestinations(selectedOptions);
      setFormData((prev) => ({
        ...prev,
        study_abroad_destinations: updatedDestinations,
      }));
      onUpdate({ study_abroad_destinations: updatedDestinations }); // ✅ Prevents unnecessary updates
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Study Abroad Destinations</h2>

      {/* Multi-Select Dropdown */}
      <Select
        isMulti
        isLoading={loading}
        options={destinations.map((dest) => ({
          value: dest.id,
          label: dest.title,
        }))}
        value={selectedDestinations} // ✅ Prefilled correctly
        onChange={handleDestinationChange}
        className="w-full"
        placeholder="Select study destinations..."
      />

      {/* Display Selected Destinations */}
      {selectedDestinations.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedDestinations.map((dest) => (
            <span key={dest.value} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
              {dest.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultancyStudyDest;
