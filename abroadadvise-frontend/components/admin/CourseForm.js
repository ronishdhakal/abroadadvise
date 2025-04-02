"use client";

import { useState, useEffect, useMemo } from "react";
import {
  createCourse,
  updateCourse,
  fetchCourseDetails,
} from "@/utils/api";

import CourseHeader from "./course/CourseHeader";
import CourseAbout from "./course/CourseAbout";
import CourseInfo from "./course/CourseInfo";

const CourseForm = ({ courseSlug, onSuccess, onCancel }) => {
  const isEditing = !!courseSlug;

  // ✅ Memoize default state to avoid rerenders
  const defaultFormData = useMemo(() => ({
    name: "",
    abbreviation: "",
    slug: "",
    duration: "",
    level: "",
    fee: "",
    short_description: "",
    eligibility: "",
    course_structure: "",
    job_prospects: "",
    features: "",
    scholarship: "",
    priority: "",
    icon: null,
    cover_image: null,
    university: null,
    disciplines: [],
    destination: null,
  }), []);

  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Load course data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      setError("");
      fetchCourseDetails(courseSlug)
        .then((data) => {
          console.log("✅ Fetched Course Data:", data);
          setFormData((prev) => ({
            ...prev,
            ...data,
            icon: data.icon || prev.icon,
            cover_image: data.cover_image || prev.cover_image,
            university: data.university_details?.id || null,
            disciplines: data.disciplines_details?.map((d) => d.id) || [],
            destination: data.destination_details?.id || null,
          }));
        })
        .catch((error) => {
          console.error("❌ Error loading course details:", error);
          setError("❌ Failed to load course details");
        })
        .finally(() => setLoading(false));
    }
  }, [courseSlug, isEditing]);

  // ✅ Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "icon" &&
        key !== "cover_image" &&
        key !== "disciplines" &&
        value !== null &&
        value !== undefined
      ) {
        submissionData.append(key, value);
      }
    });

    formData.disciplines.forEach((id) =>
      submissionData.append("disciplines", Number(id))
    );

    if (formData.icon instanceof File) {
      submissionData.append("icon", formData.icon);
    }
    if (formData.cover_image instanceof File) {
      submissionData.append("cover_image", formData.cover_image);
    }

    console.log("📤 Submitting Course FormData:");
    for (let pair of submissionData.entries()) {
      console.log(`🔹 ${pair[0]}:`, pair[1]);
    }

    try {
      if (isEditing) {
        await updateCourse(courseSlug, submissionData);
        setSuccess("✅ Course updated successfully!");
      } else {
        await createCourse(submissionData);
        setSuccess("✅ Course created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err.message || "❌ Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Course" : "Create Course"}
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* ✅ Dropdown Info (with pagination support inside CourseInfo) */}
        <CourseInfo formData={formData} setFormData={setFormData} />

        {/* ✅ Course Static Fields */}
        <CourseHeader formData={formData} setFormData={setFormData} />

        {/* ✅ Rich Text Areas */}
        <CourseAbout formData={formData} setFormData={setFormData} />

        {/* ✅ Form Actions */}
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

export default CourseForm;
