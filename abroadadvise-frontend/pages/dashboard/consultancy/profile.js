"use client";

import { useState, useEffect } from "react";
import ConsultancySidebar from "./ConsultancySidebar";
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
  const [allDistricts, setAllDistricts] = useState([]);
  const [updatedFields, setUpdatedFields] = useState({});

  // ✅ Fetch Consultancy Profile & Districts
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching consultancy profile & districts...");
        const [consultancyData, districtsData] = await Promise.all([
          fetchConsultancyDashboard(),
          fetchDistricts(),
        ]);

        console.log("✅ Consultancy Data from API:", consultancyData);

        setAllDistricts(districtsData?.results || []);

        // ✅ Ensure all fields exist in `formData` to prevent data loss
        const formattedConsultancyData = {
          ...consultancyData,
          districts: consultancyData.districts?.map((d) => d.id) || [],
          study_abroad_destinations: consultancyData.study_abroad_destinations || [],
          test_preparation: consultancyData.test_preparation || [],
          partner_universities: consultancyData.partner_universities || [],
          branches: consultancyData.branches || [],
          gallery_images: consultancyData.gallery_images || [],
          about: consultancyData.about?.trim() || "",
          services: consultancyData.services?.trim() || "",
        };

        console.log("✅ Final Processed formData (Prefill Fixed):", formattedConsultancyData);
        setFormData(formattedConsultancyData);
      } catch (error) {
        console.error("❌ Error fetching consultancy data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Section-Specific Updates (Preserves Other Fields)
  const handleSectionUpdate = (updatedValues) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedValues, // ✅ Merge updates
    }));

    setUpdatedFields((prev) => ({
      ...prev,
      ...updatedValues, // ✅ Track only updated fields
    }));
  };

  // ✅ Handle Full Profile Update (Sends Only Changed Fields)
  // ✅ Handle Full Profile Update (Prevent Select Field Deletion)
// ✅ Handle Full Profile Update (Prevent Select Field Deletion & Handle Gallery Images)
const handleProfileUpdate = async () => {
  if (!formData) return;

  try {
    const updateData = new FormData();

    // ✅ Preserve existing select fields (to prevent deletion)
    const safeFields = [
      "districts",
      "branches",
      "study_abroad_destinations",
      "test_preparation",
      "partner_universities",
    ];

    safeFields.forEach((field) => {
      if (!updatedFields[field] && formData[field]) {
        updateData.append(field, JSON.stringify(formData[field])); // ✅ Send existing values if not changed
      }
    });

    // ✅ Handle Gallery Images (Preserve old ones, add new, and track deleted)
    if (formData.gallery_images) {
      // 🔹 Separate old & new images
      const existingImages = formData.gallery_images
        .filter((img) => !img.file) // Keep existing images
        .map((img) => img.id); // Only send IDs of existing images

      const newImages = formData.gallery_images.filter((img) => img.file); // New images to upload

      // ✅ Send existing image IDs
      updateData.append("existing_gallery_images", JSON.stringify(existingImages));

      // ✅ Append new images
      newImages.forEach((img) => {
        updateData.append("gallery_images", img.file);
      });

      // ✅ Append deleted image IDs (if any)
      if (formData.deleted_gallery_images && formData.deleted_gallery_images.length > 0) {
        updateData.append("deleted_gallery_images", JSON.stringify(formData.deleted_gallery_images));
      }
    }

    // ✅ Append only modified fields to avoid data loss
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] !== null && updatedFields[key] !== undefined) {
        updateData.append(key, JSON.stringify(updatedFields[key]));
      }
    });

    await updateConsultancyDashboard(updateData);

    // ✅ Merge updated fields into existing data to prevent loss
    setFormData((prev) => ({ ...prev, ...updatedFields }));
    setUpdatedFields({}); // ✅ Reset modified fields after submission

    console.log("✅ Profile updated successfully:", updatedFields);
    alert("Profile updated successfully!");
  } catch (err) {
    console.error("❌ Profile update failed:", err);
    alert("Profile update failed. Please try again.");
  }
};



  if (loading) {
    return <p className="text-center py-6 text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center py-6 text-red-600">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ConsultancySidebar />

      {/* Main Profile Section */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">Consultancy Profile</h2>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <ConsultancyHeader formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <ConsultancyContact formData={formData} setFormData={setFormData} allDistricts={allDistricts} onUpdate={handleSectionUpdate} />
            <ConsultancyAbout formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <ConsultancyBranches formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <ConsultancyGallery formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <ConsultancyStudyDest formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <ConsultancyTestPrep formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <ConsultancyUniversities formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
          </div>

          {/* ✅ Submit Button for All Updates */}
          <div className="text-center mt-6">
            <button
              onClick={handleProfileUpdate}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                Object.keys(updatedFields).length === 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={Object.keys(updatedFields).length === 0}
            >
              {Object.keys(updatedFields).length === 0 ? "No Changes" : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyProfile;
