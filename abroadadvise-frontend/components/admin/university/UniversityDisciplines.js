"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDisciplines } from "@/utils/api"; // API function to fetch disciplines

const UniversityDisciplines = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Pagination component (modeled after DestinationsPage)
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded ${
              p === currentPage ? "bg-[#4c9bd5] text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  // Fetch paginated disciplines
  useEffect(() => {
    setLoading(true);
    fetchDisciplines(page, search)
      .then((data) => {
        setDisciplines(data.results || []);
        setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
      })
      .catch((error) => console.error("❌ Error fetching disciplines:", error))
      .finally(() => setLoading(false));
  }, [page, search]);

  // Handle Discipline Selection
  useEffect(() => {
    if (disciplines.length > 0) {
      const selected = (formData.disciplines || [])
        .map((id) => {
          const discipline = disciplines.find((d) => d.id === id);
          return discipline
            ? { value: discipline.id.toString(), label: discipline.name }
            : null;
        })
        .filter(Boolean);
      setSelectedDisciplines(selected);
    } else {
      setSelectedDisciplines([]);
    }
  }, [disciplines, formData.disciplines]);

  const handleDisciplineChange = (selectedOptions) => {
    setSelectedDisciplines(selectedOptions || []);
    setFormData((prev) => ({
      ...prev,
      disciplines: selectedOptions
        ? selectedOptions.map((opt) => Number(opt.value)) // Convert to integer IDs
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

      {/* Multi-Select Dropdown for Disciplines */}
      <Select
        isMulti
        isLoading={loading}
        options={disciplines
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((discipline) => ({
            value: discipline.id.toString(), // Ensure string values for React-Select
            label: discipline.name,
          }))}
        value={selectedDisciplines}
        onChange={handleDisciplineChange}
        className="w-full"
        placeholder="Select disciplines..."
        isSearchable={false} // Search handled by input above
      />

      {/* Display Selected Disciplines as Tags */}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default UniversityDisciplines;