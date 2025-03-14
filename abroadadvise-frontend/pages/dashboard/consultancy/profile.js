"use client";

import { useState, useEffect } from "react";
import ConsultancyAbout from "./profile/ConsultancyAbout";
import ConsultancyBranches from "./profile/ConsultancyBranches";
import ConsultancyGallery from "./profile/ConsultancyGallery";
import ConsultancyHeader from "./profile/ConsultancyHeader";
import ConsultancyTestPrep from "./profile/ConsultancyTestPrep";
import ConsultancyUniversities from "./profile/ConsultancyUniversities";
import ConsultancyContact from "./profile/ConsultancyContact";
import ConsultancyStudyDest from "./profile/ConsultancyStudyDest";
import { fetchConsultancyDashboard, fetchDistricts, updateConsultancyDashboard } from "@/utils/api";

const ConsultancyProfile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allDistricts, setAllDistricts] = useState([]); // Store all available districts

  // Fetch Consultancy Profile & Districts
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching consultancy profile & districts...");
        const [consultancyData, districtsData] = await Promise.all([
          fetchConsultancyDashboard(),
          fetchDistricts(),
        ]);

        console.log("✅ Fetched Consultancy Data:", consultancyData);
        console.log("✅ Fetched Districts Data:", districtsData);

        setAllDistricts(districtsData?.results || []);

        // Convert `districts` to an array of IDs before setting `formData`
        const formattedConsultancyData = {
          ...consultancyData,
          districts: consultancyData.districts?.map((d) => d.id) || [],
        };

        console.log("✅ Final Processed formData:", formattedConsultancyData);

        setFormData(formattedConsultancyData);
      } catch (error) {
        console.error("❌ Error fetching consultancy data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch data only once on mount

  // Handle Section-Specific Updates
  const handleSectionUpdate = async (updatedFields) => {
    if (!formData) return;

    try {
      const updateData = new FormData();

      // Preserve unchanged fields and only update modified ones
      Object.keys(updatedFields).forEach((key) => {
        if (updatedFields[key] !== null && updatedFields[key] !== undefined) {
          updateData.append(key, JSON.stringify(updatedFields[key]));
        }
      });

      await updateConsultancyDashboard(updateData);
      setFormData((prev) => ({ ...prev, ...updatedFields })); // Keep form data consistent
      console.log("✅ Updated successfully:", updatedFields);
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  if (loading) {
    return <p className="text-center py-6 text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center py-6 text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-8">
      {/* Pass `onUpdate` to each section for independent updates */}
      <ConsultancyHeader formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
      <ConsultancyContact formData={formData} setFormData={setFormData} allDistricts={allDistricts} onUpdate={handleSectionUpdate} />
      <ConsultancyAbout formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
      <ConsultancyBranches formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
      <ConsultancyGallery formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
      <ConsultancyStudyDest formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
      <ConsultancyTestPrep formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
      <ConsultancyUniversities formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
    </div>
  );
};

export default ConsultancyProfile;
