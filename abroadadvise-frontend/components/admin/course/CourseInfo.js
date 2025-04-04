"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import {
  fetchDisciplines,
  fetchUniversitiesDropdown,
  fetchDestinationsDropdown,
} from "@/utils/api";

const CourseInfo = ({ formData, setFormData }) => {
  const [loadingDisciplines, setLoadingDisciplines] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  
  const [disciplines, setDisciplines] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  
  const [disciplineSearch, setDisciplineSearch] = useState("");

  // ✅ Fetch Disciplines (similar to UniversityDisciplines)
  const loadAllDisciplines = async () => {
    setLoadingDisciplines(true);
    let all = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const data = await fetchDisciplines(page, "");
        all = [...all, ...(data.results || [])];
        const total = data.count || 0;
        hasMore = all.length < total;
        page++;
      }
      setDisciplines(all);
    } catch (err) {
      console.error("❌ Error loading all disciplines:", err);
    } finally {
      setLoadingDisciplines(false);
    }
  };

  useEffect(() => {
    loadAllDisciplines();
  }, []);

  // ✅ Fetch Universities (similar to ConsultancyUniversities)
  useEffect(() => {
    setLoadingUniversities(true);
    fetchUniversitiesDropdown()
      .then((data) => setUniversities(data || []))
      .catch((error) => console.error("Error fetching universities:", error))
      .finally(() => setLoadingUniversities(false));
  }, []);

  // ✅ Fetch Destinations (similar to ConsultancyStudyDest)
  useEffect(() => {
    setLoadingDestinations(true);
    fetchDestinationsDropdown()
      .then((data) => setDestinations(data || []))
      .catch((error) => console.error("Error fetching destinations:", error))
      .finally(() => setLoadingDestinations(false));
  }, []);

  // ✅ Handlers
  const handleDisciplineChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      disciplines: selectedOptions
        ? selectedOptions.map((opt) => Number(opt.value))
        : [],
    }));
  };

  const handleUniversityChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      university: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleDestinationChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      destination: selectedOption ? selectedOption.value : "",
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Information</h2>

      {/* ✅ Disciplines */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-1">Disciplines</h3>
        <input
          type="text"
          placeholder="Search disciplines..."
          value={disciplineSearch}
          onChange={(e) => setDisciplineSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
        />
        <Select
          isMulti
          isLoading={loadingDisciplines}
          options={disciplines
            .filter((d) => d.name.toLowerCase().includes(disciplineSearch.toLowerCase()))
            .map((discipline) => ({
              value: discipline.id.toString(),
              label: discipline.name,
            }))}
          value={formData.disciplines
            ?.map((id) => {
              const discipline = disciplines.find((d) => d.id === id);
              return discipline
                ? { value: discipline.id.toString(), label: discipline.name }
                : null;
            })
            .filter(Boolean)}
          onChange={handleDisciplineChange}
          className="w-full"
          placeholder="Select disciplines..."
          isSearchable={false} // Handled manually via input
        />
        {formData.disciplines?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {formData.disciplines.map((id) => {
              const discipline = disciplines.find((d) => d.id === id);
              return (
                discipline && (
                  <span
                    key={discipline.id}
                    className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md"
                  >
                    {discipline.name}
                  </span>
                )
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ University */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-1">University</h3>
        <Select
          isLoading={loadingUniversities}
          options={universities.map((university) => ({
            value: university.id,
            label: university.name,
          }))}
          value={
            formData.university
              ? {
                  value: formData.university,
                  label: universities.find((u) => u.id === formData.university)?.name,
                }
              : null
          }
          onChange={handleUniversityChange}
          className="w-full"
          placeholder="Select university..."
          isClearable
        />
        {formData.university && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
              {universities.find((u) => u.id === formData.university)?.name}
            </span>
          </div>
        )}
      </div>

      {/* ✅ Destination */}
      <div>
        <h3 className="text-gray-700 font-medium mb-1">Study Destination</h3>
        <Select
          isLoading={loadingDestinations}
          options={destinations.map((dest) => ({
            value: dest.id,
            label: dest.title,
          }))}
          value={
            formData.destination
              ? {
                  value: formData.destination,
                  label: destinations.find((d) => d.id === formData.destination)?.title,
                }
              : null
          }
          onChange={handleDestinationChange}
          className="w-full"
          placeholder="Select study destination..."
          isClearable
        />
        {formData.destination && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
              {destinations.find((d) => d.id === formData.destination)?.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseInfo;