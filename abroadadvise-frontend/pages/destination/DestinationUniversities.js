"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";

const DestinationUniversities = ({ universities = [], destination }) => {
  if (!destination) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const universitiesPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const matchedUniversities = universities.filter(
    (university) => university.country === destination.title
  );

  const indexOfLast = currentPage * universitiesPerPage;
  const indexOfFirst = indexOfLast - universitiesPerPage;
  const currentUniversities = matchedUniversities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(matchedUniversities.length / universitiesPerPage);

  const handleApplyNow = (university) => {
    setSelectedEntity({
      entityType: "university",
      universityId: university.id,
      universityName: university.name,
      destinationId: destination.id,
      destinationName: destination.title,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-5xl mx-auto mt-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Top Universities in {destination.title}
      </h2>

      <div className="flex flex-col gap-4">
        {currentUniversities.length > 0 ? (
          currentUniversities.map((university) => (
            <div
              key={university.id}
              className="flex items-center justify-between p-4 bg-[#f9fbfc] border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <a
                href={`/university/${university.slug}`}
                className="flex items-center gap-4 flex-grow group"
              >
                {university.logo ? (
                  <img
                    src={university.logo}
                    alt={university.name}
                    className="h-12 w-12 object-cover rounded-md border"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-md" />
                )}

                <p className="text-sm font-medium text-gray-800 group-hover:text-[#4c9bd5] transition">
                  {university.name}
                </p>
              </a>

              <button
                onClick={() => handleApplyNow(university)}
                className="px-4 py-2 bg-[#4c9bd5] hover:bg-[#3e8bc5] text-white font-medium text-sm rounded-md transition"
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No universities available in {destination.title}.
          </p>
        )}
      </div>

      {/* Pagination */}
      {matchedUniversities.length > universitiesPerPage && (
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
          entityType="university"
          entityId={selectedEntity.universityId}
          entityName={selectedEntity.universityName}
          additionalData={{
            destinationId: selectedEntity.destinationId,
            destinationName: selectedEntity.destinationName,
          }}
        />
      )}
    </div>
  );
};

export default DestinationUniversities;
