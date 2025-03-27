"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchExams } from "@/utils/api";

const ConsultancyTestPrep = ({ formData, setFormData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);

  // ✅ Load exams from API
  useEffect(() => {
    if (exams.length === 0) {
      setLoading(true);
      fetchExams()
        .then((data) => setExams(data.results || []))
        .catch((error) => console.error("Error fetching exams:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  // ✅ Prefill selected test preparation exams
  useEffect(() => {
    if (formData?.test_preparation?.length && exams.length > 0) {
      const preselected = exams
        .filter((exam) => formData.test_preparation.includes(exam.id))
        .map((exam) => ({
          value: exam.id,
          label: exam.name,
        }));

      setSelectedExams(preselected);
    }
  }, [formData?.test_preparation, exams]);

  // ✅ Handle test preparation selection
  const handleTestPrepChange = (selectedOptions) => {
    setSelectedExams(selectedOptions);
    const updatedExams = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];

    setFormData((prev) => ({
      ...prev,
      test_preparation: updatedExams,
    }));
    onUpdate({ test_preparation: updatedExams }); // ✅ Pass changes to parent
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Test Preparation</h2>

      {/* Multi-Select Dropdown */}
      <Select
        isMulti
        isLoading={loading}
        options={exams.map((exam) => ({
          value: exam.id,
          label: exam.name,
        }))}
        value={selectedExams} // ✅ Prefilled correctly
        onChange={handleTestPrepChange}
        className="w-full"
        placeholder="Select test preparation classes..."
      />

      {/* Display Selected Test Prep Classes */}
      {selectedExams.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedExams.map((exam) => (
            <span key={exam.value} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
              {exam.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultancyTestPrep;