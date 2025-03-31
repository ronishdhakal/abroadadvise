"use client";

import { useState, useEffect } from "react";
import InquiryModal from "@/components/InquiryModal";
import { BadgeCheck } from "lucide-react";

const ExamConsultancies = ({ exam }) => {
  if (!exam) return null;

  const [allConsultancies, setAllConsultancies] = useState([]);
  const [filteredConsultancies, setFilteredConsultancies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const consultanciesPerPage = 5;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAllConsultancies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultancy/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch consultancies: ${response.status}`);
        }
        const data = await response.json();
        setAllConsultancies(data.results || []);
      } catch (err) {
        console.error("❌ Error fetching consultancies:", err);
      }
    };

    fetchAllConsultancies();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (exam && allConsultancies.length > 0) {
      const examConsultancies = allConsultancies.filter((consultancy) => {
        return (
          consultancy.verified &&
          Array.isArray(consultancy.test_preparation) &&
          consultancy.test_preparation.some((ex) => ex.id === exam.id)
        );
      });
      setFilteredConsultancies(examConsultancies);
    } else {
      setFilteredConsultancies([]);
    }
  }, [exam, allConsultancies]);

  const indexOfLastConsultancy = currentPage * consultanciesPerPage;
  const indexOfFirstConsultancy = indexOfLastConsultancy - consultanciesPerPage;
  const currentConsultancies = filteredConsultancies.slice(
    indexOfFirstConsultancy,
    indexOfLastConsultancy
  );
  const totalPages = Math.ceil(filteredConsultancies.length / consultanciesPerPage);

  const handleInquiry = (consultancy) => {
    const entityData = {
      entityType: "consultancy",
      entityId: consultancy.id,
      entityName: consultancy.name,
      consultancyId: consultancy.id,
      consultancyName: consultancy.name,
      examId: exam?.id || null,
      examName: exam?.name || null,
    };

    setSelectedEntity(entityData);
    setTimeout(() => setIsModalOpen(true), 100);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Top {exam.name} Preparation Institutes in Kathmandu
      </h2>

      <div className="space-y-4">
        {currentConsultancies.length > 0 ? (
          currentConsultancies.map((consultancy) => (
            <div
              key={consultancy.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-4">
                {consultancy.logo ? (
                  <img
                    src={consultancy.logo}
                    alt={consultancy.name}
                    className="h-12 w-12 object-cover rounded-md border"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-md" />
                )}

                <a
                  href={`/consultancy/${consultancy.slug}`}
                  className="text-sm font-medium text-gray-800 hover:text-[#4c9bd5] flex items-center"
                >
                  {consultancy.name}
                  {consultancy.verified && (
                    <BadgeCheck className="h-4 w-4 text-[#4c9bd5] ml-1" />
                  )}
                </a>
              </div>

              <button
                onClick={() => handleInquiry(consultancy)}
                className="px-4 py-2 bg-[#4c9bd5] hover:bg-[#3b87c4] text-white text-sm font-semibold rounded-md transition"
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No verified consultancies available for this exam.
          </p>
        )}
      </div>

      {filteredConsultancies.length > consultanciesPerPage && (
        <div className="mt-5 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                currentPage === index + 1
                  ? "bg-[#4c9bd5] text-white border-[#4c9bd5]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {selectedEntity && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType={selectedEntity.entityType}
          entityId={selectedEntity.entityId}
          entityName={selectedEntity.entityName}
          consultancyId={selectedEntity.consultancyId}
          consultancyName={selectedEntity.consultancyName}
          examId={selectedEntity.examId}
          examName={selectedEntity.examName}
        />
      )}
    </div>
  );
};

export default ExamConsultancies;
