"use client";

import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { fetchDestinations } from "@/utils/api";
import Pagination from "@/pages/destination/Pagination";

const CollegeStudyDest = ({ formData, setFormData, allDestinations = [] }) => {
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const shouldFetch = allDestinations.length === 0;

  const loadDestinations = async () => {
    if (!shouldFetch) {
      setDestinations(allDestinations);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchDestinations(page, search);
      const newResults = data.results || [];

      // Preserve already selected ones (even if not in search result)
      const selectedDestinations = formData.study_abroad_destinations
        .map((id) => destinations.find((d) => d?.id === id) || null)
        .filter(Boolean);

      // Merge unique results
      const merged = [...new Map([...selectedDestinations, ...newResults].map((d) => [d.id, d])).values()];
      setDestinations(merged);

      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current || shouldFetch) {
      loadDestinations();
    }
    isMounted.current = true;
  }, [page, search]);

  const handleDestinationChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      study_abroad_destinations: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Study Abroad Destinations</h2>

      <input
        type="text"
        placeholder="Search destinations..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="mb-3 p-2 border border-gray-300 rounded w-full"
      />

      <Select
        isMulti
        isLoading={loading}
        options={destinations.map((dest) => ({
          value: dest.id,
          label: dest.title,
        }))}
        value={formData.study_abroad_destinations
          ?.map((id) => {
            const dest = destinations.find((d) => d.id === id);
            return dest ? { value: dest.id, label: dest.title } : null;
          })
          .filter(Boolean)}
        onChange={handleDestinationChange}
        className="w-full"
        placeholder="Select study destinations..."
      />

      {formData.study_abroad_destinations?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.study_abroad_destinations.map((id) => {
            const dest = destinations.find((d) => d.id === id);
            return (
              dest && (
                <span key={dest.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                  {dest.title}
                </span>
              )
            );
          })}
        </div>
      )}

      {shouldFetch && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default CollegeStudyDest;
