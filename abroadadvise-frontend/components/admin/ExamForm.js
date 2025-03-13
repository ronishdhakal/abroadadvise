"use client";

import { useState, useEffect } from "react";
import ExamHeader from "./exam/ExamHeader";
import ExamAbout from "./exam/ExamAbout";
import { createExam, updateExam } from "@/utils/api";

const ExamForm = ({ examSlug, examData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "",
    exam_fee: "",
    icon: null,
    short_description: "",
    about: "",
    exam_centers: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Initialize formData when `examData` changes (for Edit Mode)
  useEffect(() => {
    if (examData) {
      setFormData({
        name: examData?.name || "",
        slug: examData?.slug || "",
        type: examData?.type || "",
        exam_fee: examData?.exam_fee || "",
        icon: examData?.icon || null,
        short_description: examData?.short_description || "",
        about: examData?.about || "",
        exam_centers: examData?.exam_centers || "",
      });
    }
  }, [examData]);

  // ✅ Handle Text Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle File Input Change (For `icon`)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();

    // ✅ Append all fields to FormData (including images)
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // ✅ Debugging: Check FormData before submitting
    console.log("📤 Sending Exam FormData:");
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      let response;
      if (examSlug) {
        response = await updateExam(examSlug, formDataToSend); // ✅ Update Exam
      } else {
        response = await createExam(formDataToSend); // ✅ Create Exam
      }
      console.log("✅ Exam Saved Successfully:", response);
      onSuccess();
    } catch (err) {
      console.error("❌ Error submitting exam:", err);
      setError(err.message || "An error occurred while saving the exam.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ✅ Exam Header (Basic Details) */}
      <ExamHeader formData={formData} setFormData={setFormData} />

      {/* ✅ Exam About (Rich Text Fields) */}
      <ExamAbout formData={formData} setFormData={setFormData} />

      {/* ✅ Submit & Cancel Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : examSlug ? "Update Exam" : "Create Exam"}
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      {/* ✅ Error Message */}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default ExamForm;
