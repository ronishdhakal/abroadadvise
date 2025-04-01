"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchUniversities } from "@/utils/api"; // ✅ Shared university fetch logic

const CollegeUniversities = ({ formData, setFormData, allUniversities = [] }) => {
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    if (allUniversities.length > 0) {
      setUniversities(allUniversities);
    } else {
      setLoading(true);
      fetchUniversities()
        .then((data) => setUniversities(data.results || []))
        .catch((error) => console.error("Error fetching universities:", error))
        .finally(() => setLoading(false));
    }
  }, [allUniversities]);

  const handleUniversityChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      affiliated_universities: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Affiliated Universities</h2>

      <Select
        isMulti
        isLoading={loading}
        options={universities.map((university) => ({
          value: university.id,
          label: university.name,
        }))}
        value={formData.affiliated_universities
          ?.map((id) => {
            const university = universities.find((u) => u.id === id);
            return university ? { value: university.id, label: university.name } : null;
          })
          .filter(Boolean)}
        onChange={handleUniversityChange}
        className="w-full"
        placeholder="Select affiliated universities..."
      />

      {formData.affiliated_universities?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.affiliated_universities.map((id) => {
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

export default CollegeUniversities;
