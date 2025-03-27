"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchUniversities } from "@/utils/api";

const ConsultancyUniversities = ({ formData, setFormData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([]);

  // ✅ Load universities from API
  useEffect(() => {
    if (universities.length === 0) {
      setLoading(true);
      fetchUniversities()
        .then((data) => setUniversities(data?.results || []))
        .catch((error) => console.error("Error fetching universities:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  // ✅ Prefill selected partner universities
  useEffect(() => {
    if (
      formData?.partner_universities?.length &&
      universities.length > 0
    ) {
      const preselected = universities
        .filter((uni) => formData.partner_universities.includes(uni.id))
        .map((uni) => ({
          value: uni.id,
          label: uni.name,
        }));

      setSelectedUniversities(preselected);
    }
  }, [formData?.partner_universities, universities]);

  // ✅ Handle University Selection
  const handleUniversityChange = (selectedOptions) => {
    const updatedUniversities = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];

    if (
      JSON.stringify(updatedUniversities) !==
      JSON.stringify(formData?.partner_universities)
    ) {
      setSelectedUniversities(selectedOptions);
      setFormData((prev) => ({
        ...prev,
        partner_universities: updatedUniversities,
      }));
      onUpdate({ partner_universities: updatedUniversities });
    }
  };

  if (!formData) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <p className="text-gray-500 italic">Consultancy data not available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Partner Universities</h2>

      <Select
        isMulti
        isLoading={loading}
        options={universities.map((university) => ({
          value: university.id,
          label: university.name,
        }))}
        value={selectedUniversities}
        onChange={handleUniversityChange}
        className="w-full"
        placeholder="Select partner universities..."
      />

      {selectedUniversities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedUniversities.map((uni) => (
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
