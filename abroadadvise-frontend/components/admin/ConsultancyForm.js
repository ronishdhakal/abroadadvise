"use client";

import { useState, useEffect } from "react";
import {
  createConsultancy,
  updateConsultancy,
  fetchConsultancyDetails,
} from "@/utils/api";

import ConsultancyHeader from "./consultancy/ConsultancyHeader";
import ConsultancyContact from "./consultancy/ConsultancyContact"; // ✅ fetches districts inside
import ConsultancyStudyDest from "./consultancy/ConsultancyStudyDest"; // ✅ fetches destinations inside
import ConsultancyTestPrep from "./consultancy/ConsultancyTestPrep";
import ConsultancyBranches from "./consultancy/ConsultancyBranches";
import ConsultancyGallery from "./consultancy/ConsultancyGallery";
import ConsultancyUniversities from "./consultancy/ConsultancyUniversities"; // ✅ fetches universities inside
import ConsultancyAbout from "./consultancy/ConsultancyAbout";

const ConsultancyForm = ({
  consultancySlug,
  onSuccess,
  onCancel,
  allExams,
}) => {
  const isEditing = !!consultancySlug;

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
    districts: [],
    study_abroad_destinations: [],
    test_preparation: [],
    partner_universities: [],
    branches: [],
    gallery_images: [],
    logo: null,
    brochure: null,
    cover_photo: null,
    deleted_gallery_images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchConsultancyDetails(consultancySlug)
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            ...data,
            study_abroad_destinations: data.study_abroad_destinations?.map((d) => d.id) || [],
            test_preparation: data.test_preparation?.map((e) => e.id) || [],
            partner_universities: data.partner_universities?.map((u) => u.id) || [],
            districts: data.districts?.map((d) => d.id) || [],
            branches: data.branches || [],
            gallery_images:
              data.gallery_images?.map((img) => ({
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

  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (
          [
            "branches",
            "districts",
            "study_abroad_destinations",
            "test_preparation",
            "partner_universities",
            "deleted_gallery_images",
          ].includes(key)
        ) {
          submissionData.append(key, JSON.stringify(value));
        } else if (key === "gallery_images") {
          value.forEach((item) => {
            if (item.file) {
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
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Consultancy" : "Create Consultancy"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <ConsultancyHeader formData={formData} setFormData={setFormData} />
        <ConsultancyContact formData={formData} setFormData={setFormData} />
        <ConsultancyStudyDest formData={formData} setFormData={setFormData} />
        <ConsultancyTestPrep formData={formData} setFormData={setFormData} allExams={allExams} />
        <ConsultancyBranches formData={formData} setFormData={setFormData} />
        <ConsultancyGallery formData={formData} setFormData={setFormData} />
        <ConsultancyUniversities formData={formData} setFormData={setFormData} />
        <ConsultancyAbout formData={formData} setFormData={setFormData} />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultancyForm;
