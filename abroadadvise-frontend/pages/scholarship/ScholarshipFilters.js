"use client";

import { useEffect, useState } from "react";
import { Search, Globe, GraduationCap } from "lucide-react";
import Select from "react-select";
import { fetchDestinationsDropdown } from "@/utils/api";

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
  destinations: initialDestinations = [],
}) => {
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [error, setError] = useState(null); // Added for error tracking

  // ✅ Fetch Destinations with Debugging
  useEffect(() => {
    console.log("Initial Destinations:", initialDestinations); // Log initial prop
    if (!initialDestinations.length) {
      console.log("Fetching destinations...");
      setLoadingDestinations(true);
      fetchDestinationsDropdown()
        .then((data) => {
          console.log("Fetched Destinations:", data); // Log fetched data
          setDestinations(data || []);
          if (!data || data.length === 0) {
            setError("No destinations fetched from API");
          }
        })
        .catch((error) => {
          console.error("Error fetching destinations:", error);
          setError("Failed to fetch destinations: " + error.message);
        })
        .finally(() => {
          setLoadingDestinations(false);
          console.log("Loading complete. Current destinations:", destinations);
        });
    } else {
      console.log("Using provided initial destinations:", initialDestinations);
    }
  }, [initialDestinations]);

  // ✅ Handle Destination Change
  const handleDestinationChange = (selectedOption) => {
    const newValue = selectedOption ? selectedOption.value : "";
    console.log("Destination changed to:", newValue); // Log change
    setDestination(newValue);
  };

  // ✅ Custom styles for react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      paddingLeft: "2.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      borderColor: "#D1D5DB",
      "&:hover": { borderColor: "#2563EB" },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
      maxHeight: "200px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    option: (base, state) => ({
      ...base,
      color: state.isSelected ? "#fff" : "#000",
      backgroundColor: state.isSelected ? "#2563EB" : "#fff",
      "&:hover": {
        backgroundColor: "#E5E7EB",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "black",
    }),
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Filter Scholarships</h2>
        <button
          onClick={() => {
            setSearch("");
            setDestination("");
            setStudyLevel("");
            console.log("Filters cleared"); // Log clear action
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search by title or keyword */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              console.log("Search updated:", e.target.value); // Log search
            }}
            className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            aria-label="Search Scholarships"
          />
        </div>

        {/* Destination Dropdown */}
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Select
            isLoading={loadingDestinations}
            options={destinations.map((dest) => ({
              value: dest.id,
              label: dest.title,
            }))}
            value={
              destinations
                .map((dest) => ({
                  value: dest.id,
                  label: dest.title,
                }))
                .find((opt) => opt.value === destination) || null
            }
            onChange={handleDestinationChange}
            className="w-full"
            placeholder="All Destinations"
            isClearable
            isSearchable
            styles={customStyles}
            aria-label="Select Destination"
          />
        </div>

        {/* Study Level Dropdown */}
        <div className="relative">
          <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={studyLevel}
            onChange={(e) => {
              setStudyLevel(e.target.value);
              console.log("Study Level updated:", e.target.value); // Log study level
            }}
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