"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";

const UniversityConsultancies = ({ consultancies = [], university }) => {
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const consultanciesPerPage = 5; // Show 5 consultancies per page

  // Pagination logic
  const indexOfLastConsultancy = currentPage * consultanciesPerPage;
  const indexOfFirstConsultancy = indexOfLastConsultancy - consultanciesPerPage;
  const currentConsultancies = consultancies.slice(indexOfFirstConsultancy, indexOfLastConsultancy);

  const totalPages = Math.ceil(consultancies.length / consultanciesPerPage);

  const handleInquiry = (consultancy) => {
    console.log("🟢 Selected Consultancy:", consultancy);
    console.log("🟢 University Data:", university); // ✅ Debugging University Data

    // ✅ Ensure university and consultancy details are correctly passed
    const entityData = {
      entityType: "consultancy",
      entityId: consultancy.id,
      entityName: consultancy.name,
      consultancyId: consultancy.id,
      consultancyName: consultancy.name,
      universityId: university?.id || null,  // ✅ Always pass university ID
      universityName: university?.name || null,  // ✅ Always pass university name
    };

    setSelectedEntity(entityData);

    // ✅ Open modal only after ensuring state is updated
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  };

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply Through</h2>

      <div className="space-y-3">
        {currentConsultancies.length > 0 ? (
          currentConsultancies.map((consultancy) => (
            <div key={consultancy.id} className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                {consultancy.logo ? (
                  <img src={consultancy.logo} alt={consultancy.name} className="h-12 w-12 object-cover rounded-md" />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-md"></div>
                )}

                <div>
                  {/* Link consultancy name and location to its detail page */}
                  <a
                    href={`/consultancy/${consultancy.slug}`}
                    className="text-sm font-medium text-gray-800 hover:text-blue-600"
                  >
                    {consultancy.name}
                  </a>
                  <p className="text-xs text-gray-500">{consultancy.address || "Location not available"}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Apply button styled as per the design */}
                <button
                  onClick={() => handleInquiry(consultancy)}  // ✅ Send consultancy & university details
                  className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No consultancies available for this university.</p>
        )}
      </div>

      {consultancies.length > consultanciesPerPage && (
        <div className="mt-4 flex justify-center items-center space-x-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-2 text-sm rounded-md ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"} hover:bg-blue-500 hover:text-white`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Inquiry Modal with consultancy & university details */}
      {selectedEntity && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType={selectedEntity.entityType}
          entityId={selectedEntity.entityId}
          entityName={selectedEntity.entityName}
          consultancyId={selectedEntity.consultancyId}
          consultancyName={selectedEntity.consultancyName}
          universityId={selectedEntity.universityId}  // ✅ Pass university ID
          universityName={selectedEntity.universityName}  // ✅ Pass university name
        />
      )}
    </div>
  );
};

export default UniversityConsultancies;
