"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchExams, updateConsultancyDashboard } from "@/utils/api";

const ConsultancyTestPrep = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (exams.length === 0) {
      setLoading(true);
      fetchExams()
        .then((data) => setExams(data.results || []))
        .catch((error) => {
          console.error("Error fetching exams:", error);
          setError("Failed to load test preparation classes");
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleTestPrepChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      test_preparation: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updateData = new FormData();
      updateData.append("test_preparation", JSON.stringify(formData.test_preparation || []));
      await updateConsultancyDashboard(updateData);
      setSuccessMessage("Test preparation classes updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update test preparation classes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Test Preparation</h2>

      <Select
        isMulti
        isLoading={loading}
        options={exams.map((exam) => ({ value: exam.id, label: exam.name }))}
        value={formData.test_preparation
          ?.map((id) => {
            const exam = exams.find((e) => e.id === id);
            return exam ? { value: exam.id, label: exam.name } : null;
          })
          .filter(Boolean)}
        onChange={handleTestPrepChange}
        className="w-full"
        placeholder="Select test preparation classes..."
      />

      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Test Preparation"}
      </button>

      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default ConsultancyTestPrep;
