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
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-7xl mx-auto mt-6 flex items-center">
      <div className="flex items-center gap-6 w-full">
        {/* Exam Icon */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
          {exam.icon ? (
            <img
              src={exam.icon}
              alt={`${exam.name || "Exam"} icon`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-gray-400">No Icon</div>
          )}
        </div>

        {/* Exam Details */}
        <div className="flex-1">
          {/* Exam Type Badge */}
          {exam.type && (
            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full inline-block">
              {exam.type === "english_proficiency"
                ? "English Proficiency Test"
                : "Standardized Test"}
            </span>
          )}

          {/* Exam Name */}
          {exam.name && (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              {exam.name}
            </h1>
          )}

          {/* Short Description */}
          {exam.short_description && (
            <p className="text-gray-600 text-sm md:text-base mt-2">
              {exam.short_description.replace(/<\/?[^>]+(>|$)/g, "")}
            </p>
          )}

          {/* Exam Fee & Register Button */}
          <div className="flex items-center gap-6 mt-3">
            {exam.exam_fee && (
              <div className="flex items-center text-gray-700 text-lg font-medium">
                <DollarSign className="h-5 w-5 text-blue-500 mr-1" />
                <span className="font-semibold">Exam Fee: ${exam.exam_fee}</span>
              </div>
            )}

            <button
              onClick={handleInquiry}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center transition-all duration-300"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="font-semibold">Inquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;
