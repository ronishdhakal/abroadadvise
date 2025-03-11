"use client";

import { useState, useEffect } from "react";
import { 
  createUniversity, 
  updateUniversity, 
  fetchUniversityDetails, 
  toggleUniversityVerification 
} from "@/utils/api";

import UniversityHeader from "./university/UniversityHeader";
import UniversityContact from "./university/UniversityContact";
import UniversityDisciplines from "./university/UniversityDisciplines";
import UniversityCourses from "./university/UniversityCourses";
import UniversityConsultancies from "./university/UniversityConsultancies";
import UniversityAbout from "./university/UniversityAbout";

const UniversityForm = ({ universitySlug, onSuccess, onCancel, allDisciplines, allConsultancies }) => {
  const isEditing = !!universitySlug;

  // ✅ Define initial form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    priority: "",
    eligibility: "",
    facilities_features: "",
    scholarship: "",
    tuition_fees: "",
    about: "",
    faqs: "",
    is_verified: false, // ✅ Added verification toggle
    disciplines: [],
    consultancies_to_apply: [],
    logo: null,
    brochure: null,
    cover_photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");  // ✅ Fixed missing state

  // ✅ Load university data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchUniversityDetails(universitySlug)
        .then((data) => {
          console.log("Fetched University Data:", data);

          setFormData((prev) => ({
            ...prev,
            ...data,
            is_verified: data.is_verified ?? prev.is_verified, // ✅ Preserve toggle state
            disciplines: data.disciplines?.map((d) => d.id) || [],
            consultancies_to_apply: data.consultancies_to_apply?.map((c) => c.id) || [],
            logo: data.logo || prev.logo,
            cover_photo: data.cover_photo || prev.cover_photo,
            brochure: data.brochure || prev.brochure,
          }));
        })
        .catch(() => setError("Failed to load university details"))
        .finally(() => setLoading(false));
    }
  }, [universitySlug]);

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
      const updatedData = await toggleUniversityVerification(formData.slug, newStatus);
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

const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError(null);
  setSuccessMessage("");  

  try {
    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("website", formData.website);
    submissionData.append("phone", formData.phone);
    submissionData.append("address", formData.address);  // ✅ Ensure address is sent
    submissionData.append("country", formData.country);  // ✅ Ensure country is sent
    submissionData.append("priority", formData.priority);
    submissionData.append("eligibility", formData.eligibility);
    submissionData.append("facilities_features", formData.facilities_features);
    submissionData.append("scholarship", formData.scholarship);
    submissionData.append("tuition_fees", formData.tuition_fees);
    submissionData.append("about", formData.about);
    submissionData.append("faqs", formData.faqs);
    submissionData.append("is_verified", formData.is_verified.toString()); 

    // ✅ Add missing "type" field before submitting
    if (formData.type) {
      submissionData.append("type", formData.type);
    } else {
      throw new Error("❌ University type is required!");
    }

    // ✅ Handle Logo, Brochure & Cover Image
    if (formData.logo instanceof File) submissionData.append("logo", formData.logo);
    if (formData.cover_photo instanceof File) submissionData.append("cover_photo", formData.cover_photo);
    if (formData.brochure instanceof File) submissionData.append("brochure", formData.brochure);

    // ✅ Handle Multi-Select Disciplines & Consultancies
    submissionData.append("disciplines", JSON.stringify(formData.disciplines));
    submissionData.append("consultancies_to_apply", JSON.stringify(formData.consultancies_to_apply));

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
      {successMessage && <p className="text-green-500">{successMessage}</p>}  {/* ✅ Fixed this */}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* University Header */}
        <UniversityHeader formData={formData} setFormData={setFormData} />

        {/* Contact Information */}
        <UniversityContact formData={formData} setFormData={setFormData} />

        {/* University Disciplines */}
        <UniversityDisciplines formData={formData} setFormData={setFormData} allDisciplines={allDisciplines} />

        {/* University Consultancies */}
        <UniversityConsultancies formData={formData} setFormData={setFormData} allConsultancies={allConsultancies} />

        {/* Courses Offered */}
        <UniversityCourses formData={formData} setFormData={setFormData} />

        {/* About & Additional Information */}
        <UniversityAbout formData={formData} setFormData={setFormData} />

        {/* Verification Toggle */}
        <div className="mt-4">
          <label className="flex items-center text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={formData.is_verified}
              onChange={handleVerificationChange} // ✅ Toggle on change
              className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2">Verified University</span>
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

export default UniversityForm;
