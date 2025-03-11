"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDisciplines } from "@/utils/api"; // ✅ API function to fetch disciplines

const UniversityDisciplines = ({ formData, setFormData, allDisciplines = [] }) => {
  const [loading, setLoading] = useState(false);
  const [disciplines, setDisciplines] = useState([]);

  // ✅ Load disciplines from props or fetch if not available
  useEffect(() => {
    if (allDisciplines.length > 0) {
      setDisciplines(allDisciplines); // ✅ Use provided disciplines
    } else {
      setLoading(true);
      fetchDisciplines()
        .then((data) => setDisciplines(data.results || []))
        .catch((error) => console.error("Error fetching disciplines:", error))
        .finally(() => setLoading(false));
    }
  }, [allDisciplines]);

  // ✅ Handle Discipline Selection
  const handleDisciplineChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      disciplines: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">University Disciplines</h2>

      {/* Multi-Select Dropdown for Disciplines */}
      <Select
        isMulti
        isLoading={loading}
        options={disciplines.map((discipline) => ({
          value: discipline.id,
          label: discipline.name,
        }))}
        value={formData.disciplines
          ?.map((id) => {
            const discipline = disciplines.find((d) => d.id === id);
            return discipline ? { value: discipline.id, label: discipline.name } : null;
          })
          .filter(Boolean)} // ✅ Prevents null values
        onChange={handleDisciplineChange}
        className="w-full"
        placeholder="Select disciplines..."
      />

      {/* Display Selected Disciplines as Tags */}
      {formData.disciplines?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.disciplines.map((id) => {
            const discipline = disciplines.find((d) => d.id === id);
            return (
              discipline && (
                <span key={discipline.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                  {discipline.name}
                </span>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UniversityDisciplines;
