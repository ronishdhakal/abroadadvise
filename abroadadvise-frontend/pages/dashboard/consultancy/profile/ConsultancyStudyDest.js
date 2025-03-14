"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchDestinations, updateConsultancyDashboard } from "@/utils/api";

const ConsultancyStudyDest = ({ formData, setFormData, allDestinations = [] }) => {
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // ✅ Load destinations only when needed
  useEffect(() => {
    if (allDestinations.length > 0) {
      setDestinations(allDestinations);
    } else if (destinations.length === 0) {
      setLoading(true);
      fetchDestinations()
        .then((data) => setDestinations(data.results || []))
        .catch((error) => {
          console.error("Error fetching destinations:", error);
          setError("Failed to load destinations");
        })
        .finally(() => setLoading(false));
    }
  }, [allDestinations]); // ✅ Only run when `allDestinations` changes

  // ✅ Prefill selected study destinations
  useEffect(() => {
    if (formData.study_abroad_destinations?.length && destinations.length > 0) {
      const preselected = destinations
        .filter((dest) => formData.study_abroad_destinations.includes(dest.id))
        .map((dest) => ({
          value: dest.id,
          label: dest.title,
        }));

      setSelectedDestinations(preselected);
    }
  }, [formData.study_abroad_destinations, destinations]); // ✅ Runs only when dependencies change

  // ✅ Handle destination selection
  const handleDestinationChange = (selectedOptions) => {
    setSelectedDestinations(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      study_abroad_destinations: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  // ✅ Handle update request (ONLY updates study destinations)
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updateData = new FormData();
      updateData.append("study_abroad_destinations", JSON.stringify(formData.study_abroad_destinations || []));
      await updateConsultancyDashboard(updateData);
      setSuccessMessage("Study destinations updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update study destinations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Study Abroad Destinations</h2>

      <Select
        isMulti
        isLoading={loading}
        options={destinations.map((dest) => ({ value: dest.id, label: dest.title }))}
        value={selectedDestinations}
        onChange={handleDestinationChange}
        className="w-full"
        placeholder="Select study destinations..."
      />

      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Destinations"}
      </button>

      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default ConsultancyStudyDest;
