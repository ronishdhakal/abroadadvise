"use client";

import { Search, Globe, GraduationCap } from "lucide-react";

const LEVEL_OPTIONS = [
  { value: "", label: "All Levels" },
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
  { value: "diploma", label: "Diploma" },
];

const ScholarshipFilters = ({
  search = "",
  setSearch = () => {},
  destination = "",
  setDestination = () => {},
  studyLevel = "",
  setStudyLevel = () => {},
  destinations = [],
}) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Filter Scholarships</h2>
        <button
          onClick={() => {
            setSearch("");
            setDestination("");
            setStudyLevel("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search by title or keyword */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            aria-label="Search Scholarships"
          />
        </div>

        {/* Destination Dropdown */}
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm bg-white text-gray-900 text-sm"
            aria-label="Select Destination"
          >
            <option value="">All Destinations</option>
            {destinations.map((dest) => (
              <option key={dest.slug} value={dest.slug}>
                {dest.title}
              </option>
            ))}
          </select>
        </div>

        {/* Study Level Dropdown */}
        <div className="relative">
          <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={studyLevel}
            onChange={(e) => setStudyLevel(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm bg-white text-gray-900 text-sm"
            aria-label="Select Study Level"
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipFilters;
