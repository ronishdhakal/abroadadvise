"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDisciplines } from "@/utils/api";

const UniversityDisciplines = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch all pages of disciplines and merge them
  const loadAllDisciplines = async () => {
    setLoading(true);
    let all = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const data = await fetchDisciplines(page, "");
        all = [...all, ...(data.results || [])];
        const total = data.count || 0;
        hasMore = all.length < total;
        page++;
      }
      setDisciplines(all);
    } catch (err) {
      console.error("❌ Error loading all disciplines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDisciplines();
  }, []);

  useEffect(() => {
    const selected = (formData.disciplines || [])
      .map((id) => {
        const discipline = disciplines.find((d) => d.id === id);
        return discipline
          ? { value: discipline.id.toString(), label: discipline.name }
          : null;
      })
      .filter(Boolean);
    setSelectedDisciplines(selected);
  }, [disciplines, formData.disciplines]);

  const handleDisciplineChange = (selectedOptions) => {
    setSelectedDisciplines(selectedOptions || []);
    setFormData((prev) => ({
      ...prev,
      disciplines: selectedOptions
        ? selectedOptions.map((opt) => Number(opt.value))
        : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">University Disciplines</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search disciplines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mt-1 mb-2 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
      />

      {/* Multi-Select Dropdown */}
      <Select
        isMulti
        isLoading={loading}
        options={disciplines
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((discipline) => ({
            value: discipline.id.toString(),
            label: discipline.name,
          }))}
        value={selectedDisciplines}
        onChange={handleDisciplineChange}
        className="w-full"
        placeholder="Select disciplines..."
        isSearchable={false} // handled manually
      />

      {/* Display Selected Disciplines */}
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
