"use client";

import { Search, Globe, GraduationCap } from "lucide-react";
import Select from "react-select";

const CollegeFilters = ({
  search = "",
  setSearch = () => {},
  destination = "",
  setDestination = () => {},
  university = "",
  setUniversity = () => {},
  destinations = [],
  universities = [],
}) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Advanced Filters</h2>
        <button
          onClick={() => {
            setSearch("");
            setDestination("");
            setUniversity("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            aria-label="Search Colleges"
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

        {/* University Dropdown */}
        <div className="relative">
          <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm bg-white text-gray-900 text-sm"
            aria-label="Select University"
          >
            <option value="">All Universities</option>
            {universities.map((uni) => (
              <option key={uni.slug} value={uni.slug}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CollegeFilters;
