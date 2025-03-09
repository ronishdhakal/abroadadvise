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

  // ✅ Custom Styles for react-select to make text BLACK
  const customStyles = {
    control: (base) => ({
      ...base,
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black", // ✅ Black text for unselected options
      backgroundColor: state.isSelected ? "#2563eb" : "white", // ✅ Blue highlight for selected
    }),
  };

  return (
    <div className="w-full">
      {/* Search Bar & Filter Button */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
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
          className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition whitespace-nowrap"
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
                styles={customStyles} // ✅ Apply black text styles
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
                styles={customStyles} // ✅ Apply black text styles
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
                styles={customStyles} // ✅ Apply black text styles
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
