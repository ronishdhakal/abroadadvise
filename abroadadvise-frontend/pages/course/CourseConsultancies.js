"use client";

import { useState, useEffect } from "react";
import InquiryModal from "@/components/InquiryModal"; // ✅ Corrected Import Path
import { BadgeCheck } from "lucide-react"; // ✅ Import BadgeCheck icon

const CourseConsultancies = ({ course }) => {
  const [allConsultancies, setAllConsultancies] = useState([]); // All consultancies
  const [filteredConsultancies, setFilteredConsultancies] = useState([]); // Filtered consultancies
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const consultanciesPerPage = 5;
  const courseUniversityId = course?.university?.id; // Get the university ID from the course
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ 1. Fetch ALL consultancies
  useEffect(() => {
    const fetchAllConsultancies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultancy/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch consultancies: ${response.status}`);
        }
        const data = await response.json();
        console.log("🔍 All Consultancies API Response:", data);
        setAllConsultancies(data.results || []); // Store ALL consultancies result
      } catch (err) {
        console.error("❌ Error fetching consultancies:", err);
      }
    };

    fetchAllConsultancies();
  }, [API_BASE_URL]);

  // ✅ 2. Filter consultancies based on the course's university AND verification status
  useEffect(() => {
    if (courseUniversityId && allConsultancies.length > 0) {
      const universityConsultancies = allConsultancies.filter((consultancy) => {
        return (
          consultancy.verified && // ✅ Only include verified consultancies
          Array.isArray(consultancy.partner_universities) &&
          consultancy.partner_universities.some(
            (uni) => uni.id === courseUniversityId
          )
        );
      });
      setFilteredConsultancies(universityConsultancies);
    } else {
      setFilteredConsultancies([]); // Reset when no university or no data
    }
  }, [courseUniversityId, allConsultancies]);

  // ✅ 3. Pagination Logic (using filtered consultancies)
  const indexOfLastConsultancy = currentPage * consultanciesPerPage;
  const indexOfFirstConsultancy = indexOfLastConsultancy - consultanciesPerPage;
  const currentConsultancies = filteredConsultancies.slice(
    indexOfFirstConsultancy,
    indexOfLastConsultancy
  );
  const totalPages = Math.ceil(filteredConsultancies.length / consultanciesPerPage);

  // ✅ Open Inquiry Modal
  const handleApplyNow = (consultancy) => {
    setSelectedEntity({
      entityType: "consultancy",
      consultancyId: consultancy.id,
      consultancyName: consultancy.name,
      universityId: courseUniversityId, // Use the course's university ID
      universityName: course.university.name, //use the course name
    });
    setIsModalOpen(true);
  };

  console.log("🔍 Course:", course);
  console.log("🔍 Consultancies from API:", filteredConsultancies);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Apply Through
      </h2>

      {/* Debugging: Display API Response */}
      {/* <pre className="text-xs text-gray-500 bg-gray-200 p-2 rounded">
        {JSON.stringify(filteredConsultancies, null, 2)}
      </pre> */}

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
          <p className="text-sm text-gray-500">
            No verified consultancies available for this course.
          </p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {filteredConsultancies.length > consultanciesPerPage && (
        <div className="mt-4 flex justify-center items-center space-x-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-2 text-sm rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
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

export default CourseConsultancies;
