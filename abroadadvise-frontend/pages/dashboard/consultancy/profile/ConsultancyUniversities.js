"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchUniversitiesDropdown } from "@/utils/api"; // 🔄 Updated API

const ConsultancyUniversities = ({ formData, setFormData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);

  // ✅ Fetch full list of universities (non-paginated)
  useEffect(() => {
    setLoading(true);
    fetchUniversitiesDropdown()
      .then((data) => setUniversities(data || []))
      .catch((error) => console.error("Error fetching universities:", error))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Handle University Selection
  const handleUniversityChange = (selectedOptions) => {
    const updatedIds = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];

    if (JSON.stringify(updatedIds) !== JSON.stringify(formData?.partner_universities)) {
      setFormData((prev) => ({
        ...prev,
        partner_universities: updatedIds,
      }));
      onUpdate?.({ partner_universities: updatedIds });
    }
  };

  if (!formData) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <p className="text-gray-500 italic">Consultancy data not available.</p>
      </div>
    );
  }

  // ✅ Selected values shown as objects
  const selectedOptions = formData.partner_universities
    ?.map((id) => {
      const uni = universities.find((u) => u.id === id);
      return uni ? { value: uni.id, label: uni.name } : null;
    })
    .filter(Boolean);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Partner Universities</h2>

      <Select
        isMulti
        isLoading={loading}
        options={universities.map((uni) => ({
          value: uni.id,
          label: uni.name,
        }))}
        value={selectedOptions}
        onChange={handleUniversityChange}
        className="w-full"
        placeholder="Select partner universities..."
      />

      {selectedOptions?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedOptions.map((uni) => (
            <span
              key={uni.value}
              className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md"
            >
              {uni.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultancyUniversities;
