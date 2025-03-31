"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";
import { BadgeCheck } from "lucide-react";

const DestinationConsultancies = ({ consultancies = [], destination }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const consultanciesPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const matchedConsultancies = consultancies.filter(
    (consultancy) =>
      consultancy.verified &&
      Array.isArray(consultancy.study_abroad_destinations) &&
      consultancy.study_abroad_destinations.some((dest) => dest.id === destination.id)
  );

  const indexOfLast = currentPage * consultanciesPerPage;
  const indexOfFirst = indexOfLast - consultanciesPerPage;
  const currentConsultancies = matchedConsultancies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(matchedConsultancies.length / consultanciesPerPage);

  const handleApplyNow = (consultancy) => {
    setSelectedEntity({
      entityType: "consultancy",
      consultancyId: consultancy.id,
      consultancyName: consultancy.name,
      destinationId: destination.id,
      destinationName: destination.title,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Apply Through</h2>

      <div className="space-y-4">
        {currentConsultancies.length > 0 ? (
          currentConsultancies.map((consultancy) => (
            <div
              key={consultancy.id}
              className="flex items-center justify-between p-4 bg-[#f9fbfc] border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <a
                href={`/consultancy/${consultancy.slug}`}
                className="flex items-center gap-3 flex-grow group"
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
                  <span className="text-sm font-medium text-gray-800 group-hover:text-[#4c9bd5] flex items-center">
                    {consultancy.name}
                    <BadgeCheck className="h-4 w-4 text-[#4c9bd5] ml-1" />
                  </span>
                </div>
              </a>

              <button
                onClick={() => handleApplyNow(consultancy)}
                className="px-4 py-2 bg-[#4c9bd5] hover:bg-[#3e8bc5] text-white text-sm font-medium rounded-md transition shadow-sm"
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No verified consultancies available for this destination.
          </p>
        )}
      </div>

      {/* Pagination */}
      {matchedConsultancies.length > consultanciesPerPage && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition ${
                currentPage === i + 1
                  ? "bg-[#4c9bd5] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-[#4c9bd5]/10"
              }`}
            >
              {i + 1}
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
            destinationId: selectedEntity.destinationId,
            destinationName: selectedEntity.destinationName,
          }}
        />
      )}
    </div>
  );
};

export default DestinationConsultancies;
