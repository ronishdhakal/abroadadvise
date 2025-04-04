"use client";

import { useEffect, useState } from "react";
import { Search, Globe, GraduationCap } from "lucide-react";
import Select from "react-select";
import { fetchUniversitiesDropdown, fetchDestinationsDropdown } from "@/utils/api";

const CollegeFilters = ({
  search = "",
  setSearch = () => {},
  destination = "",
  setDestination = () => {},
  university = "",
  setUniversity = () => {},
  destinations: initialDestinations = [],
  universities: initialUniversities = [],
}) => {
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [universities, setUniversities] = useState(initialUniversities);

  // Fetch destinations and universities on mount if not provided
  useEffect(() => {
    if (!initialDestinations.length) {
      setLoadingDestinations(true);
      fetchDestinationsDropdown()
        .then((data) => setDestinations(data || []))
        .catch((error) => console.error("Error fetching destinations:", error))
        .finally(() => setLoadingDestinations(false));
    }
  }, [initialDestinations]);

  useEffect(() => {
    if (!initialUniversities.length) {
      setLoadingUniversities(true);
      fetchUniversitiesDropdown()
        .then((data) => setUniversities(data || []))
        .catch((error) => console.error("Error fetching universities:", error))
        .finally(() => setLoadingUniversities(false));
    }
  }, [initialUniversities]);

  const handleDestinationChange = (selectedOption) => {
    setDestination(selectedOption ? selectedOption.value : "");
  };

  const handleUniversityChange = (selectedOption) => {
    setUniversity(selectedOption ? selectedOption.value : "");
  };

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
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Select
            isLoading={loadingDestinations}
            options={destinations.map((dest) => ({
              value: dest.slug || dest.id, // Use slug if available, fallback to id
              label: dest.title,
            }))}
            value={destinations
              .map((dest) => ({
                value: dest.slug || dest.id,
                label: dest.title,
              }))
              .find((opt) => opt.value === destination) || null}
            onChange={handleDestinationChange}
            className="w-full"
            placeholder="All Destinations"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                paddingLeft: "2.5rem", // Space for the icon
                borderRadius: "0.5rem",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }),
            }}
            aria-label="Select Destination"
          />
        </div>

        {/* University Dropdown */}
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Select
            isLoading={loadingUniversities}
            options={universities.map((uni) => ({
              value: uni.slug || uni.id, // Use slug if available, fallback to id
              label: uni.name,
            }))}
            value={universities
              .map((uni) => ({
                value: uni.slug || uni.id,
                label: uni.name,
              }))
              .find((opt) => opt.value === university) || null}
            onChange={handleUniversityChange}
            className="w-full"
            placeholder="All Universities"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                paddingLeft: "2.5rem", // Space for the icon
                borderRadius: "0.5rem",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }),
            }}
            aria-label="Select University"
          />
        </div>
      </div>
    </div>
  );
};

export default CollegeFilters;