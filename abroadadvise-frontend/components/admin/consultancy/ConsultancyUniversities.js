"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchUniversities } from "@/utils/api"; // ✅ Import API function

const ConsultancyUniversities = ({ formData, setFormData, allUniversities = [] }) => {
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);

  // ✅ Load universities from props or fetch if not available
  useEffect(() => {
    if (allUniversities.length > 0) {
      setUniversities(allUniversities); // ✅ Use provided universities
    } else {
      setLoading(true);
      fetchUniversities()
        .then((data) => setUniversities(data.results || []))
        .catch((error) => console.error("Error fetching universities:", error))
        .finally(() => setLoading(false));
    }
  }, [allUniversities]);

  // ✅ Handle University Selection
  const handleUniversityChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      partner_universities: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Partner Universities</h2>

      {/* Multi-Select Dropdown for Universities */}
      <Select
        isMulti
        isLoading={loading}
        options={universities.map((university) => ({
          value: university.id,
          label: university.name,
        }))}
        value={formData.partner_universities
          ?.map((id) => {
            const university = universities.find((u) => u.id === id);
            return university ? { value: university.id, label: university.name } : null;
          })
          .filter(Boolean)} // ✅ Prevents null values
        onChange={handleUniversityChange}
        className="w-full"
        placeholder="Select partner universities..."
      />

      {/* Display Selected Universities as Tags */}
      {formData.partner_universities?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.partner_universities.map((id) => {
            const university = universities.find((u) => u.id === id);
            return (
              university && (
                <span key={university.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                  {university.name}
                </span>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsultancyUniversities;
