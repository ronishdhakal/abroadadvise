"use client";

import { useState, useEffect } from "react";
import { createUniversity, updateUniversity, fetchUniversityDetails } from "@/utils/api";

import UniversityHeader from "./university/UniversityHeader";
import UniversityContact from "./university/UniversityContact";
import UniversityAbout from "./university/UniversityAbout";
import UniversityDisciplines from "./university/UniversityDisciplines"; // ✅ Import Disciplines Component

const UniversityForm = ({ universitySlug, onSuccess, onCancel, allDisciplines }) => {
  const isEditing = !!universitySlug;

  // ✅ Define initial form state (Includes disciplines)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    country: "",
    priority: "",
    eligibility: "",
    facilities_features: "",
    scholarship: "",
    tuition_fees: "",
    about: "",
    faqs: "",
    logo: null,
    brochure: null,
    cover_photo: null,
    type: "",
    disciplines: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Load university data if editing (Now includes disciplines)
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchUniversityDetails(universitySlug)
        .then((data) => {
          console.log("✅ Fetched University Data:", data);

          setFormData((prev) => ({
            ...prev,
            ...data,
            disciplines: data.disciplines?.map((d) => d.id) || [],
            logo: data.logo || prev.logo,
            cover_photo: data.cover_photo || prev.cover_photo,
            brochure: data.brochure || prev.brochure,
          }));
        })
        .catch(() => setError("❌ Failed to load university details"))
        .finally(() => setLoading(false));
    }
  }, [isEditing, universitySlug]);

  // ✅ Automatically generate slug only if empty
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const submissionData = new FormData();
      
      // ✅ Append all text fields
      ["name", "email", "website", "phone", "address", "country", "priority", 
       "eligibility", "facilities_features", "scholarship", "tuition_fees", "about", "faqs", "type"]
        .forEach((field) => {
          if (formData[field]) submissionData.append(field, formData[field]);
        });

      // ✅ Convert disciplines to JSON before appending
      submissionData.append("disciplines", JSON.stringify(formData.disciplines));

      // ✅ Handle Logo, Brochure & Cover Image Uploads
      if (formData.logo instanceof File) submissionData.append("logo", formData.logo);
      if (formData.cover_photo instanceof File) submissionData.append("cover_photo", formData.cover_photo);
      if (formData.brochure instanceof File) submissionData.append("brochure", formData.brochure);

      console.log("🚀 Submitting University Data:", Object.fromEntries(submissionData.entries()));

      if (isEditing) {
        await updateUniversity(universitySlug, submissionData);
        setSuccessMessage("✅ University updated successfully!");
      } else {
        await createUniversity(submissionData);
        setSuccessMessage("✅ University created successfully!");
      }

      onSuccess();
    } catch (error) {
      setError(error.message || "❌ Failed to submit university. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit University" : "Create University"}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* University Header */}
        <UniversityHeader formData={formData} setFormData={setFormData} />

        {/* Contact Information */}
        <UniversityContact formData={formData} setFormData={setFormData} />

        {/* Disciplines Selection */}
        <UniversityDisciplines formData={formData} setFormData={setFormData} allDisciplines={allDisciplines} />

        {/* About & Additional Information */}
        <UniversityAbout formData={formData} setFormData={setFormData} />

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <button type="button" className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UniversityForm;
