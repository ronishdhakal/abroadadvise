"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";

const ExamConsultancies = ({ consultancies = [], exam }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const consultanciesPerPage = 5; // ✅ Show 5 consultancies per page

  // ✅ Pagination logic
  const indexOfLastConsultancy = currentPage * consultanciesPerPage;
  const indexOfFirstConsultancy = indexOfLastConsultancy - consultanciesPerPage;
  const currentConsultancies = consultancies.slice(indexOfFirstConsultancy, indexOfLastConsultancy);

  const totalPages = Math.ceil(consultancies.length / consultanciesPerPage);

  // ✅ Handle Inquiry (Pass Exam + Consultancy Data)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const handleInquiry = (consultancy) => {
    console.log("🟢 Selected Consultancy:", consultancy);
    console.log("🟢 Exam Data:", exam);

    // ✅ Pass consultancy & exam details
    const entityData = {
      entityType: "consultancy",
      entityId: consultancy.id,
      entityName: consultancy.name,
      consultancyId: consultancy.id,
      consultancyName: consultancy.name,
      examId: exam?.id || null, // ✅ Always pass exam ID
      examName: exam?.name || null, // ✅ Always pass exam name
    };

    setSelectedEntity(entityData);
    setTimeout(() => setIsModalOpen(true), 100);
  };

  // ✅ Handle Page Change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top {exam.name} Preparation Institutes in Kathmandu</h2>

      <div className="space-y-3">
        {currentConsultancies.length > 0 ? (
          currentConsultancies.map((consultancy) => (
            <div key={consultancy.id} className="flex items-center justify-between bg-gray-100 rounded-lg p-4 shadow">
              <div className="flex items-center gap-4">
                {/* ✅ Consultancy Logo */}
                {consultancy.logo ? (
                  <img src={consultancy.logo} alt={consultancy.name} className="h-12 w-12 object-cover rounded-md shadow-sm" />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-md"></div>
                )}

                <div>
                  {/* ✅ Consultancy Name */}
                  <a
                    href={`/consultancy/${consultancy.slug}`}
                    className="text-sm font-medium text-gray-800 hover:text-blue-600 block"
                  >
                    {consultancy.name}
                  </a>
                  {/* ✅ Address (Ensure it displays correctly) */}
                  <p className="text-xs text-gray-500">{consultancy.address || "Location not available"}</p>
                </div>
              </div>

              {/* ✅ Apply Now Button */}
              <button
                onClick={() => handleInquiry(consultancy)}
                className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No consultancies available for this exam.</p>
        )}
      </div>

      {/* ✅ Pagination */}
      {consultancies.length > consultanciesPerPage && (
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

      {/* ✅ Inquiry Modal */}
      {selectedEntity && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType={selectedEntity.entityType}
          entityId={selectedEntity.entityId}
          entityName={selectedEntity.entityName}
          consultancyId={selectedEntity.consultancyId}
          consultancyName={selectedEntity.consultancyName}
          examId={selectedEntity.examId} // ✅ Pass exam ID
          examName={selectedEntity.examName} // ✅ Pass exam name
        />
      )}
    </div>
  );
};

export default ExamConsultancies;
