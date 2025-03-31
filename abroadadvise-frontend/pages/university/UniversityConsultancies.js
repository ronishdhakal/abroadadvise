"use client";

import { useState, useEffect } from "react";
import InquiryModal from "@/components/InquiryModal";
import { BadgeCheck } from "lucide-react";

const UniversityConsultancies = ({ university }) => {
  const [allConsultancies, setAllConsultancies] = useState([]);
  const [filteredConsultancies, setFilteredConsultancies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const consultanciesPerPage = 5;
  const universityId = university?.id;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAllConsultancies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultancy/`);
        if (!response.ok) throw new Error(`Failed to fetch consultancies`);
        const data = await response.json();
        setAllConsultancies(data.results || []);
      } catch (err) {
        console.error("Error fetching consultancies:", err);
      }
    };
    fetchAllConsultancies();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (universityId && allConsultancies.length > 0) {
      const matched = allConsultancies.filter(
        (c) =>
          c.verified &&
          Array.isArray(c.partner_universities) &&
          c.partner_universities.some((u) => u.id === universityId)
      );
      setFilteredConsultancies(matched);
    } else {
      setFilteredConsultancies([]);
    }
  }, [universityId, allConsultancies]);

  const indexOfLast = currentPage * consultanciesPerPage;
  const indexOfFirst = indexOfLast - consultanciesPerPage;
  const currentConsultancies = filteredConsultancies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredConsultancies.length / consultanciesPerPage);

  const handleApplyNow = (consultancy) => {
    setSelectedEntity({
      entityType: "consultancy",
      consultancyId: consultancy.id,
      consultancyName: consultancy.name,
      universityId,
      universityName: university?.name,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply Through</h2>

      <div className="space-y-3">
        {currentConsultancies.length > 0 ? (
          currentConsultancies.map((consultancy) => (
            <div
              key={consultancy.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
            >
              <a
                href={`/consultancy/${consultancy.slug}`}
                className="flex items-center gap-3 flex-grow hover:text-[#4c9bd5]"
              >
                {consultancy.logo ? (
                  <img
                    src={consultancy.logo}
                    alt={consultancy.name}
                    className="h-12 w-12 object-cover rounded-md border"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-md" />
                )}
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-800">
                    {consultancy.name}
                  </span>
                  {consultancy.verified && (
                    <BadgeCheck className="h-4 w-4 text-[#4c9bd5] ml-1" />
                  )}
                </div>
              </a>

              {consultancy.verified && (
                <button
                  onClick={() => handleApplyNow(consultancy)}
                  className="ml-4 px-4 py-2 bg-[#4c9bd5] hover:bg-[#3b8ac2] text-white text-sm font-medium rounded-md transition"
                >
                  Apply
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No verified consultancies available for this university.
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredConsultancies.length > consultanciesPerPage && (
        <div className="mt-4 flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-2 text-sm rounded-md transition ${
                currentPage === idx + 1
                  ? "bg-[#4c9bd5] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-[#e0f0fa]"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Inquiry Modal */}
      {selectedEntity && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType="consultancy"
          entityId={selectedEntity.consultancyId}
          entityName={selectedEntity.consultancyName}
          additionalData={{
            universityId: selectedEntity.universityId,
            universityName: selectedEntity.universityName,
          }}
        />
      )}
    </div>
  );
};

export default UniversityConsultancies;
