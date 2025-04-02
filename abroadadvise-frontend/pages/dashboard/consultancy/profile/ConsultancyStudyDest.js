"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDestinationsDropdown } from "@/utils/api"; // ✅ Non-paginated endpoint

const ConsultancyStudyDest = ({ formData = {}, setFormData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);

  // ✅ Fetch full destination list on mount
  useEffect(() => {
    setLoading(true);
    fetchDestinationsDropdown()
      .then((data) => setDestinations(data || []))
      .catch((error) => console.error("Error fetching destinations:", error))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Handle selection change
  const handleDestinationChange = (selectedOptions) => {
    const ids = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];

    setFormData((prev) => ({
      ...prev,
      study_abroad_destinations: ids,
    }));

    onUpdate?.({ study_abroad_destinations: ids });
  };

  // ✅ Merge selected destination IDs with dropdown options
  const selectedOptions =
    Array.isArray(formData.study_abroad_destinations)
      ? formData.study_abroad_destinations
          .map((id) => {
            const dest = destinations.find((d) => d.id === id);
            return dest ? { value: dest.id, label: dest.title } : null;
          })
          .filter(Boolean)
      : [];

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Study Abroad Destinations</h2>

      <Select
        isMulti
        isLoading={loading}
        options={destinations.map((dest) => ({
          value: dest.id,
          label: dest.title,
        }))}
        value={selectedOptions}
        onChange={handleDestinationChange}
        className="w-full"
        placeholder="Select study destinations..."
      />

      {selectedOptions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedOptions.map((dest) => (
            <span
              key={dest.value}
              className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md"
            >
              {dest.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultancyStudyDest;
