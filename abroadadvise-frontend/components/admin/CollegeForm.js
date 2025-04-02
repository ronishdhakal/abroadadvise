"use client";

import { useState, useEffect } from "react";
import {
  createCollege,
  updateCollege,
  fetchCollegeDetails,
} from "@/utils/api";

import CollegeHeader from "./college/CollegeHeader";
import CollegeContact from "./college/CollegeContact";
import CollegeStudyDest from "./college/CollegeStudyDest";
import CollegeBranches from "./college/CollegeBranches";
import CollegeGallery from "./college/CollegeGallery";
import CollegeUniversities from "./college/CollegeUniversities";
import CollegeAbout from "./college/CollegeAbout";

const CollegeForm = ({
  collegeSlug,
  onSuccess,
  onCancel,
  allDistricts,
}) => {
  const isEditing = !!collegeSlug;

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
    verified: false,
    districts: [],
    study_abroad_destinations: [],
    affiliated_universities: [],
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
      fetchCollegeDetails(collegeSlug)
        .then((data) => {
          console.log("Fetched College Data:", data);
          setFormData((prev) => ({
            ...prev,
            ...data,
            study_abroad_destinations: data.study_abroad_destinations?.map((d) => d.id) || [],
            affiliated_universities: data.affiliated_universities?.map((u) => u.id) || [],
            districts: data.districts?.map((d) => d.id) || [],
            branches: data.branches || [],
            gallery_images: data.gallery_images?.map((img) => ({
              ...img,
              image: img.image || img,
              isNew: false,
            })) || [],
            logo: data.logo || prev.logo,
            cover_photo: data.cover_photo || prev.cover_photo,
            brochure: data.brochure || prev.brochure,
          }));
        })
        .catch(() => setError("Failed to load college details"))
        .finally(() => setLoading(false));
    }
  }, [collegeSlug]);

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
        if (["branches", "districts", "study_abroad_destinations", "affiliated_universities", "deleted_gallery_images"].includes(key)) {
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
        await updateCollege(collegeSlug, submissionData);
        setSuccess("College updated successfully!");
      } else {
        await createCollege(submissionData);
        setSuccess("College created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to save college.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit College" : "Create College"}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <CollegeHeader formData={formData} setFormData={setFormData} />
        <CollegeContact formData={formData} setFormData={setFormData} allDistricts={allDistricts} />
        <CollegeStudyDest formData={formData} setFormData={setFormData} />
        <CollegeBranches formData={formData} setFormData={setFormData} />
        <CollegeGallery formData={formData} setFormData={setFormData} />
        <CollegeUniversities formData={formData} setFormData={setFormData} />
        <CollegeAbout formData={formData} setFormData={setFormData} />

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

export default CollegeForm;
