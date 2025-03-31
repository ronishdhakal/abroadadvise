"use client";

import { MessageSquare, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

const ExamHeader = ({ exam, setIsModalOpen, setSelectedEntity }) => {
  if (!exam) return null;

  const handleInquiry = () => {
    if (!setSelectedEntity || !setIsModalOpen) return;
    setSelectedEntity({
      entityType: "exam",
      entityId: exam.id,
      entityName: exam.name,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-7xl mx-auto mt-8 border border-gray-100">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Exam Icon */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
          {exam.icon ? (
            <img
              src={exam.icon}
              alt={`${exam.name || "Exam"} icon`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-gray-400 text-sm">No Icon</div>
          )}
        </div>

        {/* Exam Info */}
        <div className="flex-1 w-full">
          {/* Badge */}
          {exam.type && (
            <span className="bg-[#e3f2fc] text-[#4c9bd5] text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2">
              {exam.type === "english_proficiency"
                ? "English Proficiency Test"
                : "Standardized Test"}
            </span>
          )}

          {/* Title */}
          {exam.name && (
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {exam.name}
            </h1>
          )}

          {/* Description */}
          {exam.short_description && (
            <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
              {exam.short_description.replace(/<\/?[^>]+(>|$)/g, "")}
            </p>
          )}

          {/* Exam Fee + Inquire Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
            {exam.exam_fee && (
              <div className="flex items-center text-gray-700 text-base sm:text-lg font-medium">
                <DollarSign className="h-5 w-5 text-[#4c9bd5] mr-1" />
                <span className="font-semibold">Exam Fee: ${exam.exam_fee}</span>
              </div>
            )}

            <button
              onClick={handleInquiry}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4c9bd5] hover:bg-[#3b87c4] text-white font-semibold text-sm sm:text-base rounded-lg shadow-md transition duration-300"
            >
              <MessageSquare className="h-5 w-5" />
              Inquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;
