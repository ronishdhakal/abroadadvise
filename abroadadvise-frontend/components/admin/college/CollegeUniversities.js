"use client";

import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { fetchUniversities } from "@/utils/api";
import Pagination from "@/pages/destination/Pagination";

const CollegeUniversities = ({ formData, setFormData, allUniversities = [] }) => {
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const shouldFetch = allUniversities.length === 0;

  const loadUniversities = async () => {
    if (!shouldFetch) {
      setUniversities(allUniversities);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchUniversities(page, search);
      const newResults = data.results || [];

      const selectedUniversities = formData.affiliated_universities
        .map((id) => universities.find((u) => u?.id === id) || null)
        .filter(Boolean);

      const merged = [...new Map([...selectedUniversities, ...newResults].map((u) => [u.id, u])).values()];
      setUniversities(merged);

      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Error fetching universities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current || shouldFetch) {
      loadUniversities();
    }
    isMounted.current = true;
  }, [page, search]);

  const handleUniversityChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      affiliated_universities: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Affiliated Universities</h2>

      <input
        type="text"
        placeholder="Search universities..."
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
        options={universities.map((u) => ({
          value: u.id,
          label: u.name,
        }))}
        value={formData.affiliated_universities
          ?.map((id) => {
            const university = universities.find((u) => u.id === id);
            return university ? { value: university.id, label: university.name } : null;
          })
          .filter(Boolean)}
        onChange={handleUniversityChange}
        className="w-full"
        placeholder="Select affiliated universities..."
      />

      {formData.affiliated_universities?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.affiliated_universities.map((id) => {
            const university = universities.find((u) => u.id === id);
            return (
              university && (
                <span key={university.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                  {university.name}
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

export default CollegeUniversities;
