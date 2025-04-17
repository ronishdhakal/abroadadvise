"use client";

import { useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";
import Select from "react-select";
import { fetchDisciplines } from "@/utils/api";

const UniversityFilters = ({
  searchQuery = "",
  setSearchQuery = () => {},
  countryQuery = "",
  setCountryQuery = () => {},
  typeQuery = "",
  setTypeQuery = () => {},
  selectedDisciplines = [],
  setSelectedDisciplines = () => {},
}) => {
  const [disciplineOptions, setDisciplineOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAllDisciplines = async () => {
    setLoading(true);
    let all = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const data = await fetchDisciplines(page);
        all = [...all, ...(data.results || [])];
        const total = data.count || 0;
        hasMore = all.length < total;
        page++;
      }

      const options = all.map((discipline) => ({
        value: discipline.id,
        label: discipline.name,
      }));

      setDisciplineOptions(options);
    } catch (error) {
      console.error("❌ Error fetching disciplines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDisciplines();
  }, []);

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
            setTypeQuery("");
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

        {/* 🏛️ University Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            University Type
          </label>
          <select
            value={typeQuery}
            onChange={(e) => setTypeQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="private">Private</option>
            <option value="community">Community</option>
          </select>
        </div>

        {/* 📘 Discipline (side-by-side with type on desktop) */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Discipline
          </label>
          <Select
            options={disciplineOptions}
            isMulti
            isLoading={loading}
            value={selectedDisciplines}
            onChange={setSelectedDisciplines}
            placeholder="Select disciplines..."
            styles={customStyles}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default UniversityFilters;
