"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MapPin, GraduationCap, Globe } from "lucide-react";
import Select from "react-select";
import { fetchDisciplines, fetchUniversitiesDropdown, fetchDestinationsDropdown } from "@/utils/api";

const CourseFilters = ({
  searchQuery,
  setSearchQuery,
  universityQuery,
  setUniversityQuery,
  countryQuery,
  setCountryQuery,
  selectedDisciplines,
  setSelectedDisciplines,
  disciplines: initialDisciplines = [],
  universities: initialUniversities = [],
  countries: initialCountries = [],
}) => {
  const [showFilters, setShowFilters] = useState(false); // Toggle state for filters
  const [loadingDisciplines, setLoadingDisciplines] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  
  const [disciplineOptions, setDisciplineOptions] = useState([]);
  const [universityOptions, setUniversityOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  // ✅ Fetch all pages of disciplines
  const loadAllDisciplines = async () => {
    setLoadingDisciplines(true);
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
      setLoadingDisciplines(false);
    }
  };

  // ✅ Fetch universities
  const loadUniversities = async () => {
    setLoadingUniversities(true);
    try {
      const data = await fetchUniversitiesDropdown();
      const options = (data || []).map((uni) => ({
        value: uni.slug || uni.id,
        label: uni.name,
      }));
      setUniversityOptions(options);
    } catch (error) {
      console.error("❌ Error fetching universities:", error);
    } finally {
      setLoadingUniversities(false);
    }
  };

  // ✅ Fetch countries (destinations)
  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const data = await fetchDestinationsDropdown();
      const options = (data || []).map((country) => ({
        value: country.slug || country.id,
        label: country.title,
      }));
      setCountryOptions(options);
    } catch (error) {
      console.error("❌ Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  useEffect(() => {
    if (!initialDisciplines.length) loadAllDisciplines();
    else setDisciplineOptions(initialDisciplines.map((d) => ({ value: d.id, label: d.name })));
    
    if (!initialUniversities.length) loadUniversities();
    else setUniversityOptions(initialUniversities.map((u) => ({ value: u.slug || u.id, label: u.name })));
    
    if (!initialCountries.length) loadCountries();
    else setCountryOptions(initialCountries.map((c) => ({ value: c.slug || c.id, label: c.title })));
  }, [initialDisciplines, initialUniversities, initialCountries]);

  // ✅ Custom styles
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      borderColor: "#D1D5DB",
      boxShadow: "none",
      "&:hover": { borderColor: "#2563EB" },
      paddingLeft: "2.5rem", // Space for icons
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
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      {/* Search Bar & Filter Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            aria-label="Search Courses"
          />
        </div>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition whitespace-nowrap ml-4"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5 mr-2" />
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {/* Show Filters Only When "Filters" is Clicked */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* University Dropdown */}
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <Select
              options={universityOptions}
              value={universityOptions.find((u) => u.value === universityQuery) || null}
              onChange={(selected) => setUniversityQuery(selected?.value || "")}
              placeholder="Select University..."
              styles={customStyles}
              isLoading={loadingUniversities}
              isClearable
              aria-label="Select University"
            />
          </div>

          {/* Country Search Filter (Updated to Input like UniversityFilters) */}
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by country..."
              value={countryQuery}
              onChange={(e) => setCountryQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
              aria-label="Search Country"
            />
          </div>

          {/* Discipline Multi-Select */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <Select
              isMulti
              options={disciplineOptions}
              value={selectedDisciplines}
              onChange={setSelectedDisciplines}
              placeholder="Select Disciplines..."
              styles={customStyles}
              isLoading={loadingDisciplines}
              aria-label="Select Disciplines"
            />
          </div>
        </div>
      )}

      {/* Clear Filters Button (Visible only when filters are shown) */}
      {showFilters && (
        <button
          onClick={() => {
            setSearchQuery("");
            setUniversityQuery("");
            setCountryQuery("");
            setSelectedDisciplines([]);
          }}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default CourseFilters;