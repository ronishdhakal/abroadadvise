"use client";

import { useState, useEffect } from "react";
import CollegeSidebar from "./CollegeSidebar";
import CollegeHeader from "./profile/CollegeHeader";
import CollegeContact from "./profile/CollegeContact";
import CollegeAbout from "./profile/CollegeAbout";
import CollegeBranches from "./profile/CollegeBranches";
import CollegeGallery from "./profile/CollegeGallery";


import {
  fetchCollegeDashboard,
  fetchDistricts,
  updateCollegeDashboard,
} from "@/utils/api";

const CollegeProfile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allDistricts, setAllDistricts] = useState([]);
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegeData, districtsData] = await Promise.all([
          fetchCollegeDashboard(),
          fetchDistricts(),
        ]);

        setAllDistricts(districtsData?.results || []);

        const formatted = {
          ...collegeData,
          districts: collegeData.districts?.map((d) => d.id) || [],
          
          branches: collegeData.branches || [],
          gallery_images: collegeData.gallery_images || [],
          about: collegeData.about?.trim() || "",
          services: collegeData.services?.trim() || "",
        };

        setFormData(formatted);
      } catch (err) {
        console.error("❌ Error fetching college data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSectionUpdate = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setUpdatedFields((prev) => ({ ...prev, ...values }));
  };

  const handleProfileUpdate = async () => {
    if (!formData) return;

    try {
      const updateData = new FormData();

      const arrayFields = [
        
        "branches",
        
      ];

      arrayFields.forEach((field) => {
        if (!updatedFields[field] && formData[field]) {
          updateData.append(field, JSON.stringify(formData[field]));
        }
      });

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

      Object.entries(updatedFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          updateData.append(key, JSON.stringify(value));
        }
      });

      await updateCollegeDashboard(updateData);
      setFormData((prev) => ({ ...prev, ...updatedFields }));
      setUpdatedFields({});
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Profile update failed:", err);
      alert("Profile update failed. Please try again.");
    }
  };

  if (loading) return <p className="text-center py-6 text-gray-600">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CollegeSidebar />

      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">College Profile</h2>

          {formData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <CollegeHeader
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <CollegeContact
                  formData={formData}
                  setFormData={setFormData}
                  allDistricts={allDistricts}
                  onUpdate={handleSectionUpdate}
                />
                <CollegeAbout
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <CollegeBranches
                  formData={formData}
                  setFormData={setFormData}
                  onUpdate={handleSectionUpdate}
                />
                <CollegeGallery
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
                  {Object.keys(updatedFields).length === 0 ? "No Changes" : "Update Profile"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeProfile;
