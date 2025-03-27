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
import {
  fetchConsultancyDashboard,
  fetchDistricts,
  updateConsultancyDashboard,
} from "@/utils/api";

const ConsultancyProfile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allDistricts, setAllDistricts] = useState([]);
  const [updatedFields, setUpdatedFields] = useState({});

  // ✅ Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consultancyData, districtsData] = await Promise.all([
          fetchConsultancyDashboard(),
          fetchDistricts(),
        ]);

        setAllDistricts(districtsData?.results || []);

        const formatted = {
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

        setFormData(formatted);
      } catch (err) {
        console.error("❌ Error fetching consultancy data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle per-section update
  const handleSectionUpdate = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setUpdatedFields((prev) => ({ ...prev, ...values }));
  };

  // ✅ Handle full profile update
  const handleProfileUpdate = async () => {
    if (!formData) return;

    try {
      const updateData = new FormData();

      const arrayFields = [
        "districts",
        "branches",
        "study_abroad_destinations",
        "test_preparation",
        "partner_universities",
      ];

      arrayFields.forEach((field) => {
        if (!updatedFields[field] && formData[field]) {
          updateData.append(field, JSON.stringify(formData[field]));
        }
      });

      // ✅ Gallery handling
      if (formData.gallery_images) {
        const existing = formData.gallery_images.filter((img) => !img.file).map((img) => img.id);
        const newImgs = formData.gallery_images.filter((img) => img.file);

        updateData.append("existing_gallery_images", JSON.stringify(existing));

        newImgs.forEach((img) => {
          updateData.append("gallery_images", img.file);
        });

        if (formData.deleted_gallery_images?.length > 0) {
          updateData.append("deleted_gallery_images", JSON.stringify(formData.deleted_gallery_images));
        }
      }

      // ✅ Append all updated fields
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          updateData.append(key, JSON.stringify(value));
        }
      });

      await updateConsultancyDashboard(updateData);
      setFormData((prev) => ({ ...prev, ...updatedFields }));
      setUpdatedFields({});
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
      <ConsultancySidebar />

      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
            Consultancy Profile
          </h2>

          {formData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <ConsultancyHeader
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <ConsultancyContact
                  formData={formData}
                  setFormData={setFormData}
                  allDistricts={allDistricts}
                  onUpdate={handleSectionUpdate}
                />
                <ConsultancyAbout
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <ConsultancyBranches
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <ConsultancyGallery
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <ConsultancyStudyDest
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <ConsultancyTestPrep
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <ConsultancyUniversities
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
              </div>

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
                  {Object.keys(updatedFields).length === 0
                    ? "No Changes"
                    : "Update Profile"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultancyProfile;
