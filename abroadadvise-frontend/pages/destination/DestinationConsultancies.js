"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal"; // ✅ Import Inquiry Modal
import { BadgeCheck } from "lucide-react"; // Import BadgeCheck icon

const DestinationConsultancies = ({ consultancies = [], destination }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const consultanciesPerPage = 5; // Show 5 consultancies per page

  // ✅ Inquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  // ✅ Safe check for consultancies linked to this destination AND are verified
  const matchedConsultancies = consultancies.filter(
    (consultancy) =>
      consultancy.verified && // ✅ Only include verified consultancies
      Array.isArray(consultancy.study_abroad_destinations) && // Ensure it's an array
      consultancy.study_abroad_destinations.some((dest) => dest.id === destination.id) // Check destination match
  );

  // ✅ Pagination logic
  const indexOfLastConsultancy = currentPage * consultanciesPerPage;
  const indexOfFirstConsultancy = indexOfLastConsultancy - consultanciesPerPage;
  const currentConsultancies = matchedConsultancies.slice(indexOfFirstConsultancy, indexOfLastConsultancy);
  const totalPages = Math.ceil(matchedConsultancies.length / consultanciesPerPage);

  // ✅ Open Inquiry Modal with Both Consultancy & Destination Data
  const handleApplyNow = (consultancy) => {
    setSelectedEntity({
      entityType: "consultancy",
      consultancyId: consultancy.id,
      consultancyName: consultancy.name,
      destinationId: destination.id, // ✅ Track Destination ID
      destinationName: destination.title, // ✅ Track Destination Name
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
              className="bg-gray-100 rounded-lg p-4 shadow flex items-center justify-between"
            >
              {/* ✅ Wrap Entire Card in Link */}
              <a
                href={`/consultancy/${consultancy.slug}`}
                className="flex items-center gap-3 flex-grow cursor-pointer"
              >
                {consultancy.logo ? (
                  <img
                    src={consultancy.logo}
                    alt={consultancy.name}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-md"></div>
                )}

                {/* Container for name and tick */}
                 <div className="flex items-center gap-1">
                   {/* Name and tick here */}
                    <span className="text-sm font-medium text-gray-800 hover:text-blue-600 flex items-center">
                      {consultancy.name}
                      {consultancy.verified && (
                        <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" />
                      )}
                    </span>
                  </div>
              </a>

              {/* ✅ Apply Now Button (Only for verified consultancies) */}
              {consultancy.verified && (
                <button
                  onClick={() => handleApplyNow(consultancy)}
                  className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Apply
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No verified consultancies available for this destination.</p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {matchedConsultancies.length > consultanciesPerPage && (
        <div className="mt-4 flex justify-center items-center space-x-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-2 text-sm rounded-md ${
                currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              } hover:bg-blue-500 hover:text-white`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Inquiry Modal (Now Tracking Destination & Consultancy) */}
      {selectedEntity && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType="consultancy"
          entityId={selectedEntity.consultancyId}
          entityName={selectedEntity.consultancyName}
          additionalData={{
            destinationId: selectedEntity.destinationId, // ✅ Send Destination ID
            destinationName: selectedEntity.destinationName, // ✅ Send Destination Name
          }}
        />
      )}
    </div>
  );
};

export default DestinationConsultancies;
