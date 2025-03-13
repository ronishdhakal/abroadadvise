"use client";

import { useState, useEffect } from "react";
import {
  createConsultancy,
  updateConsultancy,
  fetchConsultancyDetails,
  toggleConsultancyVerification,
} from "@/utils/api";

import ConsultancyHeader from "./consultancy/ConsultancyHeader";
import ConsultancyContact from "./consultancy/ConsultancyContact";
import ConsultancyStudyDest from "./consultancy/ConsultancyStudyDest";
import ConsultancyTestPrep from "./consultancy/ConsultancyTestPrep";
import ConsultancyBranches from "./consultancy/ConsultancyBranches";
import ConsultancyGallery from "./consultancy/ConsultancyGallery";
import ConsultancyUniversities from "./consultancy/ConsultancyUniversities";
import ConsultancyAbout from "./consultancy/ConsultancyAbout";

const ConsultancyForm = ({
  consultancySlug,
  onSuccess,
  onCancel,
  allDestinations,
  allExams,
  allUniversities,
  allDistricts,
}) => {
  const isEditing = !!consultancySlug;

  // ✅ Define initial form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    establishment_date: "",
    google_map_url: "",
    services: "",
    about: "",
    priority: "",
    moe_certified: false,
    is_verified: false, // ✅ Added verification toggle
    districts: [],
    study_abroad_destinations: [],
    test_preparation: [],
    partner_universities: [],
    branches: [],
    gallery_images: [],
    logo: null,
    brochure: null,
    cover_photo: null,
    deleted_gallery_images:[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Load consultancy data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchConsultancyDetails(consultancySlug)
        .then((data) => {
          console.log("Fetched Consultancy Data:", data);

          setFormData((prev) => ({
            ...prev,
            ...data,
            is_verified: data.is_verified ?? prev.is_verified, // ✅ Preserve toggle state
            study_abroad_destinations: data.study_abroad_destinations?.map((d) => d.id) || [],
            test_preparation: data.test_preparation?.map((e) => e.id) || [],
            partner_universities: data.partner_universities?.map((u) => u.id) || [],
            districts: data.districts?.map((d) => d.id) || [],
            branches: data.branches || [],
            gallery_images: data.gallery_images.map(img => ({ // make it so that all the gallery_images have the same structure
              ...img,
              image: img.image || img,
              isNew: false,
            })) || [],
            logo: data.logo || prev.logo,
            cover_photo: data.cover_photo || prev.cover_photo,
            brochure: data.brochure || prev.brochure,
          }));
        })
        .catch(() => setError("Failed to load consultancy details"))
        .finally(() => setLoading(false));
    }
  }, [consultancySlug]);

  // ✅ Automatically generate slug only if empty
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  // ✅ Handle verification toggle
  const handleVerificationChange = async () => {
    const newStatus = !formData.is_verified;

    // ✅ Optimistically update UI before API call
    setFormData((prev) => ({
      ...prev,
      is_verified: newStatus,
    }));

    try {
      const updatedData = await toggleConsultancyVerification(formData.slug, newStatus);
      console.log("✅ API Response after toggle:", updatedData);

      // ✅ Ensure UI reflects the API response properly
      setFormData((prev) => ({
        ...prev,
        is_verified: updatedData.is_verified,
      }));
    } catch (error) {
      console.error("❌ Toggle failed:", error);

      // ❌ Revert UI state if API fails
      setFormData((prev) => ({
        ...prev,
        is_verified: !newStatus,
      }));
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const submissionData = new FormData();

    // ✅ Append all form fields correctly
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (["branches", "districts", "study_abroad_destinations", "test_preparation", "partner_universities", "deleted_gallery_images"].includes(key)) {
          submissionData.append(key, JSON.stringify(value)); // Serialize arrays to JSON
        } else if (key === "gallery_images") {
          value.forEach((item) => {
            if (item.file) { // add the new images
              submissionData.append("gallery_images", item.file);
            }
          });
        } else {
          submissionData.append(key, value);
        }
      }
    });

    try {
      if (isEditing) {
        await updateConsultancy(consultancySlug, submissionData);
        setSuccess("Consultancy updated successfully!");
      } else {
        await createConsultancy(submissionData);
        setSuccess("Consultancy created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to save consultancy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Consultancy" : "Create Consultancy"}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Consultancy Header */}
        <ConsultancyHeader formData={formData} setFormData={setFormData} />

        {/* Contact Information */}
        <ConsultancyContact formData={formData} setFormData={setFormData} allDistricts={allDistricts} />

        {/* Study Abroad Destinations */}
        <ConsultancyStudyDest formData={formData} setFormData={setFormData} allDestinations={allDestinations} />

        {/* Test Preparation */}
        <ConsultancyTestPrep formData={formData} setFormData={setFormData} allExams={allExams} />

        {/* Branches */}
        <ConsultancyBranches formData={formData} setFormData={setFormData} />

        {/* Gallery */}
        <ConsultancyGallery formData={formData} setFormData={setFormData} />

        {/* Partner Universities */}
        <ConsultancyUniversities formData={formData} setFormData={setFormData} allUniversities={allUniversities} />

        {/* About & Services */}
        <ConsultancyAbout formData={formData} setFormData={setFormData} />

        {/* Verification Toggle */}
        <div className="mt-4">
          <label className="flex items-center text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={formData.is_verified}
              onChange={handleVerificationChange} // ✅ Toggle on change
              className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2">Verified Consultancy</span>
          </label>
        </div>

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

export default ConsultancyForm;
