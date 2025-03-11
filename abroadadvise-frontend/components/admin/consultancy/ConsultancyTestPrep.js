"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchExams } from "@/utils/api"; // ✅ Import API function

const ConsultancyTestPrep = ({ formData, setFormData, allExams = [] }) => {
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);

  // ✅ Load exams from props or fetch if not available
  useEffect(() => {
    if (allExams.length > 0) {
      setExams(allExams); // ✅ Use provided exams
    } else {
      setLoading(true);
      fetchExams()
        .then((data) => setExams(data.results || []))
        .catch((error) => console.error("Error fetching exams:", error))
        .finally(() => setLoading(false));
    }
  }, [allExams]);

  // ✅ Handle Test Preparation Selection
  const handleTestPrepChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      test_preparation: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Test Preparation</h2>

      {/* Multi-Select Dropdown for Test Preparation */}
      <Select
        isMulti
        isLoading={loading}
        options={exams.map((exam) => ({
          value: exam.id,
          label: exam.name,
        }))}
        value={formData.test_preparation
          ?.map((id) => {
            const exam = exams.find((e) => e.id === id);
            return exam ? { value: exam.id, label: exam.name } : null;
          })
          .filter(Boolean)} // ✅ Prevents null values
        onChange={handleTestPrepChange}
        className="w-full"
        placeholder="Select test preparation classes..."
      />

      {/* Display Selected Test Preparation Classes as Tags */}
      {formData.test_preparation?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.test_preparation.map((id) => {
            const exam = exams.find((e) => e.id === id);
            return (
              exam && (
                <span key={exam.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                  {exam.name}
                </span>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsultancyTestPrep;
