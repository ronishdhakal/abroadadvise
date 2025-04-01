"use client";

import { useState, useEffect } from "react";
import {
  createScholarship,
  updateScholarship,
  fetchScholarshipDetails,
} from "@/utils/api";

import ScholarshipHeader from "./scholarship/ScholarshipHeader";
import ScholarshipDetail from "./scholarship/ScholarshipAbout";

const ScholarshipForm = ({
  scholarshipSlug,
  onSuccess,
  onCancel,
  allDestinations,
}) => {
  const isEditing = !!scholarshipSlug;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    by: "",
    destination: null,
    study_level: "",
    published_date: "",
    active_from: "",
    active_to: "",
    featured_image: null,
    detail: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchScholarshipDetails(scholarshipSlug)
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            ...data,
            destination: data.destination?.id || null,
          }));
        })
        .catch(() => setError("Failed to load scholarship details"))
        .finally(() => setLoading(false));
    }
  }, [scholarshipSlug]);

  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const submissionData = new FormData();

    // ✅ Append properly formatted fields
    for (const [key, value] of Object.entries(formData)) {
      if (value !== null && value !== undefined) {
        if (key === "destination") {
          submissionData.append("destination_id", value); // ✅ this is the fix
        } else {
          submissionData.append(key, value);
        }
      }
    }

    // ✅ Debug log (optional)
    // for (let [key, value] of submissionData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      if (isEditing) {
        await updateScholarship(scholarshipSlug, submissionData);
        setSuccess("Scholarship updated successfully!");
      } else {
        await createScholarship(submissionData);
        setSuccess("Scholarship created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to save scholarship.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Scholarship" : "Create Scholarship"}
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <ScholarshipHeader
          formData={formData}
          setFormData={setFormData}
          allDestinations={allDestinations}
        />
        <ScholarshipDetail formData={formData} setFormData={setFormData} />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScholarshipForm;
