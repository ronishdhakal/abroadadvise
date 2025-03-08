import { useState } from "react";
import { Search, Filter, MapPin, GraduationCap, Globe } from "lucide-react";
import Select from "react-select";

const CourseFilters = ({
  searchQuery,
  setSearchQuery,
  universityQuery,
  setUniversityQuery,
  countryQuery,
  setCountryQuery,
  selectedDisciplines,
  setSelectedDisciplines,
  disciplines = [],
  universities = [],
  countries = [],
}) => {
  const [showFilters, setShowFilters] = useState(false); // ✅ Toggle state for filters

  // Convert disciplines, universities, & countries to react-select options
  const disciplineOptions = disciplines.map((d) => ({
    value: d?.id || "",
    label: d?.name || "Unknown",
  }));

  const countryOptions = countries.map((c) => ({
    value: c?.name || "",
    label: c?.name || "Unknown",
  }));

  const universityOptions = universities.map((u) => ({
    value: u?.slug || "",
    label: u?.name || "Unknown",
  }));

  return (
    <div className="bg-white p-4 shadow-lg rounded-xl border border-gray-200 mt-4">
      {/* Search Bar & Filter Button */}
      <div className="flex items-center justify-between">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            aria-label="Search Courses"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          className="ml-4 flex items-center text-white font-semibold bg-blue-600 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5 mr-2" />
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {/* Show Filters Only When "Filters" is Clicked */}
      {showFilters && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* University Dropdown */}
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Select
                options={universityOptions}
                value={universityOptions.find((u) => u.value === universityQuery) || null}
                onChange={(selected) => setUniversityQuery(selected?.value || null)}
                placeholder="Select University..."
                className="mt-1"
                aria-label="Select University"
              />
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Select
                options={countryOptions}
                value={countryOptions.find((c) => c.value === countryQuery) || null}
                onChange={(selected) => setCountryQuery(selected?.value || null)}
                placeholder="Select Country..."
                className="mt-1"
                aria-label="Select Country"
              />
            </div>

            {/* Discipline Multi-Select */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Select
                isMulti
                options={disciplineOptions}
                value={selectedDisciplines}
                onChange={setSelectedDisciplines}
                placeholder="Select Disciplines..."
                className="mt-1"
                aria-label="Select Disciplines"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setSearchQuery("");
              setUniversityQuery(null);
              setCountryQuery(null);
              setSelectedDisciplines([]);
            }}
            className="mt-4 text-sm text-red-600 hover:underline"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseFilters;
