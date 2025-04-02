"use client";

import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import {
  fetchDisciplines,
  fetchUniversities,
  fetchDestinations,
} from "@/utils/api";
import Pagination from "@/pages/destination/Pagination";

const CourseInfo = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);

  // ✅ Disciplines
  const [disciplines, setDisciplines] = useState([]);
  const [disciplineSearch, setDisciplineSearch] = useState("");
  const [disciplinePage, setDisciplinePage] = useState(1);
  const [disciplineTotalPages, setDisciplineTotalPages] = useState(1);
  const disciplineMounted = useRef(false);

  // ✅ Universities
  const [universities, setUniversities] = useState([]);
  const [univSearch, setUnivSearch] = useState("");
  const [univPage, setUnivPage] = useState(1);
  const [univTotalPages, setUnivTotalPages] = useState(1);
  const univMounted = useRef(false);

  // ✅ Destinations
  const [destinations, setDestinations] = useState([]);
  const [destSearch, setDestSearch] = useState("");
  const [destPage, setDestPage] = useState(1);
  const [destTotalPages, setDestTotalPages] = useState(1);
  const destMounted = useRef(false);

  // ✅ Fetch Disciplines
  useEffect(() => {
    if (!disciplineMounted.current) {
      disciplineMounted.current = true;
      return;
    }

    fetchDisciplines(disciplinePage, disciplineSearch)
      .then((data) => {
        const selected = formData.disciplines
          .map((id) => disciplines.find((d) => d.id === id))
          .filter(Boolean);

        const merged = [
          ...new Map([...selected, ...(data.results || [])].map((d) => [d.id, d])).values(),
        ];
        setDisciplines(merged);
        setDisciplineTotalPages(Math.ceil(data.count / 10));
      })
      .catch(() => setDisciplines([]));
  }, [disciplinePage, disciplineSearch]);

  // ✅ Fetch Universities
  useEffect(() => {
    if (!univMounted.current) {
      univMounted.current = true;
      return;
    }

    fetchUniversities(univPage, univSearch)
      .then((data) => {
        const selected = formData.university
          ? [universities.find((u) => u.id === formData.university)].filter(Boolean)
          : [];

        const merged = [
          ...new Map([...selected, ...(data.results || [])].map((u) => [u.id, u])).values(),
        ];
        setUniversities(merged);
        setUnivTotalPages(Math.ceil(data.count / 10));
      })
      .catch(() => setUniversities([]));
  }, [univPage, univSearch]);

  // ✅ Fetch Destinations
  useEffect(() => {
    if (!destMounted.current) {
      destMounted.current = true;
      return;
    }

    fetchDestinations(destPage, destSearch)
      .then((data) => {
        const selected = formData.destination
          ? [destinations.find((d) => d.id === formData.destination)].filter(Boolean)
          : [];

        const merged = [
          ...new Map([...selected, ...(data.results || [])].map((d) => [d.id, d])).values(),
        ];
        setDestinations(merged);
        setDestTotalPages(Math.ceil(data.count / 10));
      })
      .catch(() => setDestinations([]));
  }, [destPage, destSearch]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Information</h2>

      {/* ✅ Disciplines */}
      <label className="block text-gray-700 font-medium mb-1">Disciplines</label>
      <input
        type="text"
        placeholder="Search disciplines..."
        value={disciplineSearch}
        onChange={(e) => {
          setDisciplineSearch(e.target.value);
          setDisciplinePage(1);
        }}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <Select
        isMulti
        isLoading={loading}
        options={disciplines.map((d) => ({ value: d.id, label: d.name }))}
        value={formData.disciplines
          .map((id) => {
            const d = disciplines.find((d) => d.id === id);
            return d ? { value: d.id, label: d.name } : null;
          })
          .filter(Boolean)}
        onChange={(selected) =>
          setFormData((prev) => ({
            ...prev,
            disciplines: selected.map((opt) => opt.value),
          }))
        }
        className="w-full mb-4"
      />
      <Pagination
        currentPage={disciplinePage}
        totalPages={disciplineTotalPages}
        onPageChange={setDisciplinePage}
      />

      {/* ✅ University */}
      <label className="block text-gray-700 font-medium mb-1 mt-6">University</label>
      <input
        type="text"
        placeholder="Search universities..."
        value={univSearch}
        onChange={(e) => {
          setUnivSearch(e.target.value);
          setUnivPage(1);
        }}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <Select
        isLoading={loading}
        options={universities.map((u) => ({ value: u.id, label: u.name }))}
        value={
          formData.university
            ? {
                value: formData.university,
                label: universities.find((u) => u.id === formData.university)?.name,
              }
            : null
        }
        onChange={(selected) =>
          setFormData((prev) => ({ ...prev, university: selected.value }))
        }
        className="w-full mb-4"
      />
      <Pagination
        currentPage={univPage}
        totalPages={univTotalPages}
        onPageChange={setUnivPage}
      />

      {/* ✅ Destination */}
      <label className="block text-gray-700 font-medium mb-1 mt-6">Study Destination</label>
      <input
        type="text"
        placeholder="Search destinations..."
        value={destSearch}
        onChange={(e) => {
          setDestSearch(e.target.value);
          setDestPage(1);
        }}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <Select
        isLoading={loading}
        options={destinations.map((d) => ({ value: d.id, label: d.title }))}
        value={
          formData.destination
            ? {
                value: formData.destination,
                label: destinations.find((d) => d.id === formData.destination)?.title,
              }
            : null
        }
        onChange={(selected) =>
          setFormData((prev) => ({ ...prev, destination: selected.value }))
        }
        className="w-full"
      />
      <Pagination
        currentPage={destPage}
        totalPages={destTotalPages}
        onPageChange={setDestPage}
      />
    </div>
  );
};

export default CourseInfo;
