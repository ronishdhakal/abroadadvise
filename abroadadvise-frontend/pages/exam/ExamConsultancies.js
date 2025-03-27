"use client";

import { useState, useEffect } from "react";
import InquiryModal from "@/components/InquiryModal";
import { BadgeCheck } from "lucide-react";

const ExamConsultancies = ({ exam }) => {
  if (!exam) return null; // ✅ Prevent crash if exam is undefined

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
        console.log("🔍 All Consultancies API Response:", data);
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

      <div className="space-y-3">
        {currentConsultancies.length > 0 ? (
          currentConsultancies.map((consultancy) => (
            <div
              key={consultancy.id}
              className="flex items-center justify-between bg-gray-100 rounded-lg p-4 shadow"
            >
              <div className="flex items-center gap-4">
                {consultancy.logo ? (
                  <img
                    src={consultancy.logo}
                    alt={consultancy.name}
                    className="h-12 w-12 object-cover rounded-md shadow-sm"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-md"></div>
                )}

                <div className="flex items-center gap-1">
                  <a
                    href={`/consultancy/${consultancy.slug}`}
                    className="text-sm font-medium text-gray-800 hover:text-blue-600 flex items-center"
                  >
                    {consultancy.name}
                    {consultancy.verified && (
                      <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" />
                    )}
                  </a>
                </div>
              </div>

              {consultancy.verified && (
                <button
                  onClick={() => handleInquiry(consultancy)}
                  className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Apply
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No verified consultancies available for this exam.</p>
        )}
      </div>

      {filteredConsultancies.length > consultanciesPerPage && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-2 text-sm rounded-md ${
                currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              } hover:bg-blue-500 hover:text-white`}
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
