"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDestinationsDropdown } from "@/utils/api";

const CollegeStudyDest = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchDestinationsDropdown()
      .then((data) => setDestinations(data || []))
      .catch((error) => console.error("Error fetching destinations:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleDestinationChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      study_abroad_destinations: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    }));
  };

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
        value={formData.study_abroad_destinations
          ?.map((id) => {
            const dest = destinations.find((d) => d.id === id);
            return dest ? { value: dest.id, label: dest.title } : null;
          })
          .filter(Boolean)}
        onChange={handleDestinationChange}
        className="w-full"
        placeholder="Select study destinations..."
      />

      {formData.study_abroad_destinations?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.study_abroad_destinations.map((id) => {
            const dest = destinations.find((d) => d.id === id);
            return (
              dest && (
                <span key={dest.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                  {dest.title}
                </span>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollegeStudyDest;
