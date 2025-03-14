"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchUniversities, updateConsultancyDashboard } from "@/utils/api";

const ConsultancyUniversities = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // ✅ Load universities only when needed
  useEffect(() => {
    if (universities.length === 0) {
      setLoading(true);
      fetchUniversities()
        .then((data) => setUniversities(data.results || []))
        .catch((error) => {
          console.error("Error fetching universities:", error);
          setError("Failed to load partner universities");
        })
        .finally(() => setLoading(false));
    }
  }, []); // ✅ Runs only once when the component mounts

  // ✅ Prefill selected partner universities
  useEffect(() => {
    if (formData.partner_universities?.length && universities.length > 0) {
      const preselected = universities
        .filter((uni) => formData.partner_universities.includes(uni.id))
        .map((uni) => ({
          value: uni.id,
          label: uni.name,
        }));

      setSelectedUniversities(preselected);
    }
  }, [formData.partner_universities, universities]); // ✅ Runs only when dependencies change

  // ✅ Handle university selection
  const handleUniversityChange = (selectedOptions) => {
    setSelectedUniversities(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      partner_universities: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  // ✅ Handle update request (ONLY updates universities)
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updateData = new FormData();
      updateData.append("partner_universities", JSON.stringify(formData.partner_universities || []));
      await updateConsultancyDashboard(updateData);
      setSuccessMessage("Partner universities updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update partner universities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Partner Universities</h2>

      <Select
        isMulti
        isLoading={loading}
        options={universities.map((university) => ({ value: university.id, label: university.name }))}
        value={selectedUniversities}
        onChange={handleUniversityChange}
        className="w-full"
        placeholder="Select partner universities..."
      />

      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Universities"}
      </button>

      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default ConsultancyUniversities;
