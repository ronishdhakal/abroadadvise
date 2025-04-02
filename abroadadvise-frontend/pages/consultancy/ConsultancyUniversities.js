"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { fetchAllUniversities } from "@/utils/api";

const ConsultancyUniversities = ({
  openInquiryModal,
  consultancyId,
  consultancyName,
  verified,
  allUniversities = [],
  preselectedIds = [],
}) => {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        let data = [];

        if (allUniversities.length > 0) {
          data = allUniversities;
        } else {
          const response = await fetchAllUniversities();
          data = response.results || [];
        }

        const selected = data.filter((uni) => preselectedIds.includes(uni.id));
        setUniversities(selected);
        setFilteredUniversities(selected);
      } catch (err) {
        console.error("Failed to load universities:", err);
      }
    };

    loadUniversities();
  }, [allUniversities, preselectedIds]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUniversities(universities);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUniversities(
        universities.filter((uni) =>
          uni.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, universities]);

  const visibleUniversities = showAll
    ? filteredUniversities
    : filteredUniversities.slice(0, 6);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
        Partner Universities
      </h2>

      {/* 🔍 Search Bar (always shown) */}
      {universities.length > 6 && (
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search university..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c9bd5]"
          />
        </div>
      )}

      {/* Universities Grid or No Match */}
      {filteredUniversities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {visibleUniversities.map((university) => (
            <div
              key={university.id}
              className="flex flex-col items-start p-6 border border-gray-200 rounded-xl bg-[#f9fafb] hover:bg-[#f1f5f9] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Link
                href={`/university/${university.slug}`}
                className="flex items-center gap-4 w-full mb-4"
              >
                <img
                  src={university.logo || "/placeholder-university.png"}
                  alt={university.name}
                  className="w-14 h-14 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold text-lg leading-tight line-clamp-2">
                    {university.name}
                  </p>
                  <span className="text-sm text-gray-600 mt-1 block">
                    {university.country || "Unknown Country"}
                  </span>
                </div>
              </Link>

              {verified && (
                <button
                  onClick={() =>
                    openInquiryModal(
                      "university",
                      university.id,
                      university.name,
                      consultancyId,
                      consultancyName
                    )
                  }
                  className="mt-auto w-full px-4 py-2 bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Apply Now
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm mt-2">
          No universities match your search.
        </p>
      )}

      {/* Show More / Less Button */}
      {filteredUniversities.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center px-6 py-2.5 bg-[#4c9bd5] text-white text-sm font-medium rounded-full hover:bg-[#3a8cc1] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            {showAll ? (
              <>
                <ChevronUpIcon className="h-5 w-5 mr-2 transform group-hover:-translate-y-0.5 transition-transform duration-300" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-5 w-5 mr-2 transform group-hover:translate-y-0.5 transition-transform duration-300" />
                Show All ({filteredUniversities.length})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultancyUniversities;
