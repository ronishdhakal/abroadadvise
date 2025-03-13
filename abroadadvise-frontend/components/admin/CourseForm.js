"use client";

import { useState, useEffect } from "react";
import { createCourse, updateCourse, fetchCourseDetails } from "@/utils/api";

import CourseHeader from "./course/CourseHeader";
import CourseAbout from "./course/CourseAbout";

const CourseForm = ({ courseSlug, onSuccess, onCancel }) => {
  const isEditing = !!courseSlug;

  // ✅ Define initial form state
  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Load course data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchCourseDetails(courseSlug)
        .then((data) => {
          console.log("✅ Fetched Course Data:", data);
          setFormData((prev) => ({
            ...prev,
            ...data,
            icon: data.icon || prev.icon,
            cover_image: data.cover_image || prev.cover_image,
          }));
        })
        .catch(() => setError("❌ Failed to load course details"))
        .finally(() => setLoading(false));
    }
  }, [courseSlug]);

  // ✅ Handle Slug (Auto-generate but allow manual edit)
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
  
    const submissionData = new FormData();
  
    // ✅ Append all non-file fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "icon" && key !== "cover_image" && value !== null && value !== undefined) {
        submissionData.append(key, value);
      }
    });
  
    // ✅ Append image fields only if they are new files
    if (formData.icon instanceof File) {
      submissionData.append("icon", formData.icon);
    }
    if (formData.cover_image instanceof File) {
      submissionData.append("cover_image", formData.cover_image);
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
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Course" : "Create Course"}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* ✅ Course Header */}
        <CourseHeader formData={formData} setFormData={setFormData} />

        {/* ✅ Course About (Rich Text Fields) */}
        <CourseAbout formData={formData} setFormData={setFormData} />

        {/* ✅ Submit & Cancel Buttons */}
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
