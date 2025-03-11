"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchConsultancies } from "@/utils/api"; // ✅ Import API function

const UniversityConsultancies = ({ formData, setFormData, allConsultancies = [] }) => {
  const [loading, setLoading] = useState(false);
  const [consultancies, setConsultancies] = useState([]);

  // ✅ Load consultancies from props or fetch if not available
  useEffect(() => {
    if (allConsultancies.length > 0) {
      setConsultancies(allConsultancies); // ✅ Use provided consultancies
    } else {
      setLoading(true);
      fetchConsultancies()
        .then((data) => setConsultancies(data.results || []))
        .catch((error) => console.error("Error fetching consultancies:", error))
        .finally(() => setLoading(false));
    }
  }, [allConsultancies]);

  // ✅ Handle Consultancy Selection
  const handleConsultancyChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      consultancies_to_apply: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Apply Through Consultancies</h2>

      {/* Multi-Select Dropdown for Consultancies */}
      <Select
        isMulti
        isLoading={loading}
        options={consultancies.map((consultancy) => ({
          value: consultancy.id,
          label: consultancy.name,
        }))}
        value={formData.consultancies_to_apply
          ?.map((id) => {
            const consultancy = consultancies.find((c) => c.id === id);
            return consultancy ? { value: consultancy.id, label: consultancy.name } : null;
          })
          .filter(Boolean)} // ✅ Prevents null values
        onChange={handleConsultancyChange}
        className="w-full"
        placeholder="Select consultancies for application..."
      />

      {/* Display Selected Consultancies as Tags */}
      {formData.consultancies_to_apply?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.consultancies_to_apply.map((id) => {
            const consultancy = consultancies.find((c) => c.id === id);
            return (
              consultancy && (
                <span key={consultancy.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                  {consultancy.name}
                </span>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UniversityConsultancies;
