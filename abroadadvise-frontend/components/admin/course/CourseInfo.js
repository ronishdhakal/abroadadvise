"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDisciplines, fetchUniversities, fetchDestinations } from "@/utils/api"; // ✅ API functions

const CourseInfo = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [disciplines, setDisciplines] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // ✅ Fetch Disciplines
  useEffect(() => {
    setLoading(true);
    fetchDisciplines()
      .then((data) => setDisciplines(data.results || data))
      .catch(() => setDisciplines([]))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Fetch Universities
  useEffect(() => {
    setLoading(true);
    fetchUniversities()
      .then((data) => setUniversities(data.results || data))
      .catch(() => setUniversities([]))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Fetch Destinations
  useEffect(() => {
    setLoading(true);
    fetchDestinations()
      .then((data) => setDestinations(data.results || data))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Information</h2>

      {/* Select Disciplines */}
      <label className="block text-gray-700 font-medium">Disciplines</label>
      <Select
        isMulti
        options={disciplines.map((d) => ({ value: d.id, label: d.name }))}
        value={formData.disciplines?.map((id) => {
          const discipline = disciplines.find((d) => d.id === id);
          return discipline ? { value: discipline.id, label: discipline.name } : null;
        }).filter(Boolean)}
        onChange={(selectedOptions) => setFormData((prev) => ({ ...prev, disciplines: selectedOptions.map((opt) => Number(opt.value)) }))}
        className="w-full mb-4"
      />

      {/* Select University */}
      <label className="block text-gray-700 font-medium">University</label>
      <Select
        options={universities.map((u) => ({ value: u.id, label: u.name }))}
        value={formData.university ? {value: formData.university, label: universities.find((u) => u.id === formData.university)?.name} : null}
        onChange={(selectedOption) => setFormData((prev) => ({ ...prev, university: selectedOption.value }))}
        className="w-full mb-4"
      />

      {/* Select Destination */}
      <label className="block text-gray-700 font-medium">Study Destination</label>
      <Select
        options={destinations.map((d) => ({ value: d.id, label: d.title }))}
        value={formData.destination ? {value: formData.destination, label: destinations.find((d) => d.id === formData.destination)?.title} : null}
        onChange={(selectedOption) => setFormData((prev) => ({ ...prev, destination: selectedOption.value }))}
        className="w-full"
      />
    </div>
  );
};

export default CourseInfo;
