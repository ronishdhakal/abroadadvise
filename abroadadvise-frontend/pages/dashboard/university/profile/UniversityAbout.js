"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react"; 
import { updateUniversityDashboard } from "@/utils/api";

const UniversityAbout = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [aboutContent, setAboutContent] = useState("");
  const [eligibilityContent, setEligibilityContent] = useState("");
  const [facilitiesContent, setFacilitiesContent] = useState("");
  const [scholarshipContent, setScholarshipContent] = useState("");
  const [faqsContent, setFaqsContent] = useState(""); 

  // ✅ Sync form data when editing (with safe fallback)
  useEffect(() => {
    if (!formData) return;
    setAboutContent(formData.about || "");
    setEligibilityContent(formData.eligibility || "");
    setFacilitiesContent(formData.facilities_features || "");
    setScholarshipContent(formData.scholarship || "");
    setFaqsContent(formData.faqs || ""); 
  }, [formData]);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = new FormData();
      updateData.append("about", aboutContent);
      updateData.append("eligibility", eligibilityContent);
      updateData.append("facilities_features", facilitiesContent);
      updateData.append("scholarship", scholarshipContent);
      updateData.append("faqs", faqsContent);

      await updateUniversityDashboard(updateData);
      setSuccessMessage("University details updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SSR safeguard
  if (!formData) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <p className="text-gray-500 italic">Loading university details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">About & Details</h2>

      {/* About University */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">About University</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={aboutContent}
          onEditorChange={(content) => {
            setAboutContent(content);
            setFormData((prev) => ({ ...prev, about: content }));
          }}
          init={{
            height: 250,
            menubar: false,
            plugins: "advlist autolink lists link image charmap preview anchor table",
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
          }}
        />
      </div>

      {/* Eligibility Criteria */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Eligibility Criteria</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={eligibilityContent}
          onEditorChange={(content) => {
            setEligibilityContent(content);
            setFormData((prev) => ({ ...prev, eligibility: content }));
          }}
          init={{
            height: 250,
            menubar: false,
            plugins: "advlist autolink lists link image charmap preview anchor table",
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
          }}
        />
      </div>

      {/* Facilities & Features */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">University Facilities</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={facilitiesContent}
          onEditorChange={(content) => {
            setFacilitiesContent(content);
            setFormData((prev) => ({ ...prev, facilities_features: content }));
          }}
          init={{
            height: 250,
            menubar: false,
            plugins: "advlist autolink lists link image charmap preview anchor table",
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
          }}
        />
      </div>

      {/* Scholarships */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Scholarships Offered</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={scholarshipContent}
          onEditorChange={(content) => {
            setScholarshipContent(content);
            setFormData((prev) => ({ ...prev, scholarship: content }));
          }}
          init={{
            height: 250,
            menubar: false,
            plugins: "advlist autolink lists link image charmap preview anchor table",
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
          }}
        />
      </div>

      {/* FAQs */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Frequently Asked Questions (FAQs)</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={faqsContent}
          onEditorChange={(content) => {
            setFaqsContent(content);
            setFormData((prev) => ({ ...prev, faqs: content }));
          }}
          init={{
            height: 250,
            menubar: false,
            plugins: "advlist autolink lists link image charmap preview anchor table",
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
          }}
        />
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Details"}
      </button>

      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default UniversityAbout;
