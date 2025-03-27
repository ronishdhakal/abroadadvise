"use client";

import { Search, MapPin } from "lucide-react";
import Select from "react-select";

const UniversityFilters = ({
  searchQuery = "",
  setSearchQuery = () => {},
  countryQuery = "",
  setCountryQuery = () => {},
  selectedDisciplines = [],
  setSelectedDisciplines = () => {},
  disciplines = [],
}) => {
  // ✅ Convert disciplines to react-select options safely
  const disciplineOptions = Array.isArray(disciplines)
    ? disciplines.map((discipline) => ({
        value: discipline.id,
        label: discipline.name,
      }))
    : [];

  // ✅ Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      borderColor: "#D1D5DB",
      boxShadow: "none",
      "&:hover": { borderColor: "#2563EB" },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#fff" : "#000",
      backgroundColor: state.isSelected ? "#2563EB" : "#fff",
      "&:hover": {
        backgroundColor: "#E5E7EB",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    }),
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Advanced Filters</h2>
        <button
          onClick={() => {
            setSearchQuery("");
            setCountryQuery("");
            setSelectedDisciplines([]);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 🔍 University Name Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
          />
        </div>

        {/* 🌍 Country Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by country..."
            value={countryQuery}
            onChange={(e) => setCountryQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
          />
        </div>

        {/* 📘 Discipline Filter */}
        {disciplineOptions.length > 0 && (
          <div className="col-span-full">
            <label className="text-sm font-medium text-gray-700">Discipline</label>
            <Select
              options={disciplineOptions}
              isMulti
              value={selectedDisciplines}
              onChange={setSelectedDisciplines}
              placeholder="Select disciplines..."
              styles={customStyles}
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityFilters;
