"use client";

import { useState, useEffect } from "react";
import UniversitySidebar from "./UniversitySidebar";
import UniversityHeader from "./profile/UniversityHeader";
import UniversityContact from "./profile/UniversityContact";
import UniversityOverview from "./profile/UniversityOverview";
import UniversityAbout from "./profile/UniversityAbout";
import {
  fetchUniversityDashboard,
  updateUniversityDashboard,
} from "@/utils/api";

const UniversityProfile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const universityData = await fetchUniversityDashboard();

        const formattedUniversityData = {
          ...universityData,
          about: universityData.about?.trim() || "",
          eligibility: universityData.eligibility?.trim() || "",
          facilities_features: universityData.facilities_features?.trim() || "",
          scholarship: universityData.scholarship?.trim() || "",
          faqs: universityData.faqs?.trim() || "",
        };

        setFormData(formattedUniversityData);
      } catch (error) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSectionUpdate = (updatedValues) => {
    setFormData((prev) => ({ ...prev, ...updatedValues }));
    setUpdatedFields((prev) => ({ ...prev, ...updatedValues }));
  };

  const handleProfileUpdate = async () => {
    if (!formData) return;

    try {
      const updateData = new FormData();

      Object.keys(updatedFields).forEach((key) => {
        if (updatedFields[key] !== null && updatedFields[key] !== undefined) {
          if (updatedFields[key] instanceof File) {
            updateData.append(key, updatedFields[key]);
          } else {
            updateData.append(key, JSON.stringify(updatedFields[key]));
          }
        }
      });

      await updateUniversityDashboard(updateData);
      setFormData((prev) => ({ ...prev, ...updatedFields }));
      setUpdatedFields({});
      alert("Profile updated successfully!");
    } catch (err) {
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="md:w-64 border-r border-gray-200 bg-white shadow-sm">
        <UniversitySidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-6 py-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#4c9bd5] mb-2 tracking-tight">
            University Profile
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Manage your university profile and keep your information up to date.
          </p>

          {/* Profile Sections - Full Width, Stacked */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-gray-100 rounded-xl shadow p-6">
              <UniversityHeader
                formData={formData}
                setFormData={setFormData}
                onUpdate={handleSectionUpdate}
              />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow p-6">
              <UniversityContact
                formData={formData}
                setFormData={setFormData}
                onUpdate={handleSectionUpdate}
              />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow p-6">
              <UniversityOverview
                formData={formData}
                setFormData={setFormData}
                onUpdate={handleSectionUpdate}
              />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow p-6">
              <UniversityAbout
                formData={formData}
                setFormData={setFormData}
                onUpdate={handleSectionUpdate}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleProfileUpdate}
              className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                Object.keys(updatedFields).length === 0
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-[#4c9bd5] hover:bg-[#3e8ac1] text-white"
              }`}
              disabled={Object.keys(updatedFields).length === 0}
            >
              {Object.keys(updatedFields).length === 0
                ? "No Changes"
                : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;
