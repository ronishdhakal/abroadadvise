"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react"; // ✅ Rich Text Editor for Better Formatting

const UniversityAbout = ({ formData, setFormData }) => {
  // ✅ Local states for content fields
  const [aboutContent, setAboutContent] = useState("");
  const [eligibilityContent, setEligibilityContent] = useState("");
  const [facilitiesContent, setFacilitiesContent] = useState("");
  const [scholarshipContent, setScholarshipContent] = useState("");
  const [faqsContent, setFaqsContent] = useState(""); // ✅ Added FAQs Field
  const [priority, setPriority] = useState(""); // ✅ Added Priority Field

  // ✅ Sync form data when editing
  useEffect(() => {
    setAboutContent(formData.about || "");
    setEligibilityContent(formData.eligibility || "");
    setFacilitiesContent(formData.facilities_features || "");
    setScholarshipContent(formData.scholarship || "");
    setFaqsContent(formData.faqs || ""); // ✅ Load FAQs
    setPriority(formData.priority || ""); // ✅ Load priority from formData
  }, [
    formData.about,
    formData.eligibility,
    formData.facilities_features,
    formData.scholarship,
    formData.faqs,
    formData.priority,
  ]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">About & Details</h2>

      {/* ✅ Priority Field */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Priority (Lower number = Higher Rank)
        </label>
        <input
          type="number"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            setFormData((prev) => ({ ...prev, priority: e.target.value }));
          }}
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
          placeholder="Enter priority (e.g., 1, 2, 3)"
        />
      </div>

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
    </div>
  );
};

export default UniversityAbout;
