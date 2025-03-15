"use client";

import { useState, useEffect } from "react";
import UniversitySidebar from "./UniversitySidebar"; // ✅ Sidebar Added
import UniversityHeader from "./profile/UniversityHeader";
import UniversityContact from "./profile/UniversityContact";
import UniversityOverview from "./profile/UniversityOverview";
import UniversityAbout from "./profile/UniversityAbout";
import { fetchUniversityDashboard, updateUniversityDashboard } from "@/utils/api";

const UniversityProfile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});

  // ✅ Fetch University Profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching university profile...");
        const universityData = await fetchUniversityDashboard();

        console.log("✅ University Data from API:", universityData);

        // ✅ Ensure all fields exist in `formData` to prevent data loss
        const formattedUniversityData = {
          ...universityData,
          about: universityData.about?.trim() || "",
          eligibility: universityData.eligibility?.trim() || "",
          facilities_features: universityData.facilities_features?.trim() || "",
          scholarship: universityData.scholarship?.trim() || "",
          faqs: universityData.faqs?.trim() || "",
        };

        console.log("✅ Final Processed formData:", formattedUniversityData);
        setFormData(formattedUniversityData);
      } catch (error) {
        console.error("❌ Error fetching university data:", error);
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
  const handleProfileUpdate = async () => {
    if (!formData) return;

    try {
      const updateData = new FormData();

      // ✅ Append only modified fields to avoid data loss
      Object.keys(updatedFields).forEach((key) => {
        if (updatedFields[key] !== null && updatedFields[key] !== undefined) {
          // ✅ Handle file uploads separately
          if (updatedFields[key] instanceof File) {
            updateData.append(key, updatedFields[key]);
          } else {
            updateData.append(key, JSON.stringify(updatedFields[key]));
          }
        }
      });

      await updateUniversityDashboard(updateData);

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
      {/* ✅ Sidebar */}
      <UniversitySidebar />

      {/* Main Profile Section */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">University Profile</h2>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <UniversityHeader formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <UniversityContact formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <UniversityOverview formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
            <UniversityAbout formData={formData} setFormData={setFormData} onUpdate={handleSectionUpdate} />
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

export default UniversityProfile;
