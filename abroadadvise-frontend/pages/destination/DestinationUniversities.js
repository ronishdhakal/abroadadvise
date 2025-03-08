"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal"; // ✅ Import Inquiry Modal

const DestinationUniversities = ({ universities = [], destination }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const universitiesPerPage = 6; // Show 6 universities per page

  // ✅ Inquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  // ✅ Filter universities that belong to this destination
  const matchedUniversities = universities.filter(
    (university) => university.country === destination.title
  );

  // ✅ Pagination logic
  const indexOfLastUniversity = currentPage * universitiesPerPage;
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
  const currentUniversities = matchedUniversities.slice(indexOfFirstUniversity, indexOfLastUniversity);
  const totalPages = Math.ceil(matchedUniversities.length / universitiesPerPage);

  // ✅ Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ✅ Open Inquiry Modal with Both University & Destination Data
  const handleApplyNow = (university) => {
    setSelectedEntity({
      entityType: "university",
      universityId: university.id,
      universityName: university.name,
      destinationId: destination.id, // ✅ Track Destination ID
      destinationName: destination.title, // ✅ Track Destination Name
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Top Universities in {destination.title}
      </h2>

      {/* ✅ Updated Layout for Desktop & Mobile */}
      <div className="flex flex-col space-y-4">
        {currentUniversities.length > 0 ? (
          currentUniversities.map((university) => (
            <div
              key={university.id}
              className="bg-gray-100 rounded-lg p-4 shadow flex items-center justify-between"
            >
              {/* ✅ Wrap Entire Card in Link */}
              <a
                href={`/university/${university.slug}`}
                className="flex items-center flex-grow gap-4 cursor-pointer"
              >
                {university.logo ? (
                  <img
                    src={university.logo}
                    alt={university.name}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-md"></div>
                )}

                <p className="text-sm font-medium text-gray-800 hover:text-blue-600">
                  {university.name}
                </p>
              </a>

              {/* ✅ Apply Now Button */}
              <button
                onClick={() => handleApplyNow(university)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition-all"
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

      {/* ✅ Pagination Controls */}
      {matchedUniversities.length > universitiesPerPage && (
        <div className="mt-4 flex justify-center items-center space-x-4">
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

      {/* ✅ Inquiry Modal (Now Tracking Destination & University) */}
      {selectedEntity && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType="university"
          entityId={selectedEntity.universityId}
          entityName={selectedEntity.universityName}
          additionalData={{
            destinationId: selectedEntity.destinationId, // ✅ Send Destination ID
            destinationName: selectedEntity.destinationName, // ✅ Send Destination Name
          }}
        />
      )}
    </div>
  );
};

export default DestinationUniversities;
