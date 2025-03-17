"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDisciplines } from "@/utils/api"; // ✅ API function to fetch disciplines

const UniversityDisciplines = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);

  // ✅ Fetch all available disciplines from API
  useEffect(() => {
    setLoading(true);
    fetchDisciplines()
      .then((data) => {
        setDisciplines(data.results || []);
      })
      .catch((error) => console.error("❌ Error fetching disciplines:", error))
      .finally(() => setLoading(false));
  }, []);

  // Handle Discipline Selection
  useEffect(() => {
    if (disciplines.length > 0) {
      const selected = (formData.disciplines || [])
        .map((id) => {
          const discipline = disciplines.find((d) => d.id === id);
          return discipline
            ? { value: discipline.id.toString(), label: discipline.name }
            : null;
        })
        .filter(Boolean);
      setSelectedDisciplines(selected);
    } else {
        setSelectedDisciplines([]);
    }
  }, [disciplines, formData.disciplines]); // ✅ Add formData.disciplines to dependencies

  const handleDisciplineChange = (selectedOptions) => {
    setSelectedDisciplines(selectedOptions || []);
    setFormData((prev) => ({
      ...prev,
      disciplines: selectedOptions
        ? selectedOptions.map((opt) => Number(opt.value)) // ✅ Convert to integer IDs
        : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        University Disciplines
      </h2>

      {/* Multi-Select Dropdown for Disciplines */}
      <Select
        isMulti
        isLoading={loading}
        options={disciplines.map((discipline) => ({
          value: discipline.id.toString(), // ✅ Ensure string values for React-Select
          label: discipline.name,
        }))}
        value={selectedDisciplines}
        onChange={handleDisciplineChange}
        className="w-full"
        placeholder="Select disciplines..."
      />

      {/* Display Selected Disciplines as Tags */}
      {selectedDisciplines.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedDisciplines.map((option) => (
            <span
              key={option.value}
              className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md"
            >
              {option.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversityDisciplines;
