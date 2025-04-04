"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import {
  fetchConsultancies,
  fetchUniversities,
  fetchDestinations,
} from "@/utils/api";

const EventOverview = ({
  formData,
  setFormData,
  allDestinations,
  setAllDestinations, // Add setAllDestinations
  allUniversities,
  setAllUniversities, // Add setAllUniversities
  allConsultancies,
  pageDestinations,
  setPageDestinations,
  totalPagesDestinations,
  pageUniversities,
  setPageUniversities,
  totalPagesUniversities,
  pageConsultancies,
  setPageConsultancies,
  totalPagesConsultancies,
  searchDestinations,
  setSearchDestinations,
  searchUniversities,
  setSearchUniversities,
  searchConsultancies,
  setSearchConsultancies,
}) => {
  // Pagination component
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

  // ✅ Function to merge selected items with fetched data
  const mergeSelected = (fetchedList, selectedSlugs, key = "slug", labelKey = "name") => {
    const merged = [...fetchedList];
    selectedSlugs.forEach((slug) => {
      if (!fetchedList.find((item) => item[key] === slug)) {
        merged.push({ [key]: slug, [labelKey]: slug });
      }
    });
    return merged;
  };

  const handleOrganizerTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      organizer_slug: "",
      organizer_type: e.target.value, // Update the organizer_type
    }));
  };

  const handleOrganizerChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      organizer_slug: e.target.value || "",
    }));
  };

  const handleSelectChange = (selectedOptions, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Event Organizer & Destinations</h2>

      {/* Organizer Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Organizer Type:</label>
        <select
          name="organizer_type"
          value={formData.organizer_type || "consultancy"} // Set default value
          onChange={handleOrganizerTypeChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="consultancy">Consultancy</option>
        </select>
      </div>

      {/* Organizer Slug */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Organizer:</label>
        <input
          type="text"
          placeholder="Search Consultancies"
          value={searchConsultancies}
          onChange={(e) => setSearchConsultancies(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
        />
        <select
          name="organizer_slug"
          value={formData.organizer_slug || ""}
          onChange={handleOrganizerChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        >
          <option value="">Select Organizer</option>
          {allConsultancies.map((org) => (
            <option key={org.slug} value={org.slug}>
              {org.name}
            </option>
          ))}
        </select>
        {totalPagesConsultancies > 1 && (
          <Pagination
            currentPage={pageConsultancies}
            totalPages={totalPagesConsultancies}
            onPageChange={setPageConsultancies}
          />
        )}
      </div>

      {/* Targeted Destinations */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Targeted Destinations:</label>
        <input
          type="text"
          placeholder="Search Destinations"
          value={searchDestinations}
          onChange={(e) => setSearchDestinations(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
        />
        <Select
          isMulti
          isSearchable={false} // Search handled by input above
          options={mergeSelected(
            allDestinations
              .filter((d) => d.title.toLowerCase().includes(searchDestinations.toLowerCase()))
              .map((d) => ({
                value: d.slug,
                label: d.title,
              })),
            formData.targeted_destinations,
            "value",
            "label"
          )}
          value={formData.targeted_destinations
            .map((slug) => {
              const d = allDestinations.find((dest) => dest.slug === slug);
              return d ? { value: d.slug, label: d.title } : null;
            })
            .filter(Boolean)}
          onChange={(selected) => handleSelectChange(selected, "targeted_destinations")}
          className="mt-1"
          placeholder="Select destinations..."
        />
        {totalPagesDestinations > 1 && (
          <Pagination
            currentPage={pageDestinations}
            totalPages={totalPagesDestinations}
            onPageChange={setPageDestinations}
          />
        )}
      </div>

      {/* Participating Universities */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Participating Universities:</label>
        <input
          type="text"
          placeholder="Search Universities"
          value={searchUniversities}
          onChange={(e) => setSearchUniversities(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
        />
        <Select
          isMulti
          isSearchable={false} // Search handled by input above
          options={mergeSelected(
            allUniversities
              .filter((u) => u.name.toLowerCase().includes(searchUniversities.toLowerCase()))
              .map((u) => ({
                value: u.slug,
                label: u.name,
              })),
            formData.related_universities,
            "value",
            "label"
          )}
          value={formData.related_universities
            .map((slug) => {
              const uni = allUniversities.find((u) => u.slug === slug);
              return uni ? { value: uni.slug, label: uni.name } : null;
            })
            .filter(Boolean)}
          onChange={(selected) => handleSelectChange(selected, "related_universities")}
          className="mt-1"
          placeholder="Select universities..."
        />
        {totalPagesUniversities > 1 && (
          <Pagination
            currentPage={pageUniversities}
            totalPages={totalPagesUniversities}
            onPageChange={setPageUniversities}
          />
        )}
      </div>

      {/* Related Consultancies */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Related Consultancies:</label>
        <input
          type="text"
          placeholder="Search Consultancies"
          value={searchConsultancies}
          onChange={(e) => setSearchConsultancies(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
        />
        <Select
          isMulti
          isSearchable={false} // Search handled by input above
          options={allConsultancies
            .filter((c) => c.name.toLowerCase().includes(searchConsultancies.toLowerCase()))
            .map((c) => ({
              value: c.slug,
              label: c.name,
            }))}
          value={formData.related_consultancies
            .map((slug) => {
              const c = allConsultancies.find((x) => x.slug === slug);
              return c ? { value: c.slug, label: c.name } : null;
            })
            .filter(Boolean)}
          onChange={(selected) => handleSelectChange(selected, "related_consultancies")}
          className="mt-1"
          placeholder="Select consultancies..."
        />
        {totalPagesConsultancies > 1 && (
          <Pagination
            currentPage={pageConsultancies}
            totalPages={totalPagesConsultancies}
            onPageChange={setPageConsultancies}
          />
        )}
      </div>

      <button
        onClick={() => console.log("📌 Updated formData:", formData)}
        className="bg-gray-200 px-4 py-2 rounded-lg mt-4"
      >
        Debug Selected Data
      </button>
    </div>
  );
};

export default EventOverview;
