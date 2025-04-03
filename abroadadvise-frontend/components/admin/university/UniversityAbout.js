"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const UniversityAbout = ({ formData, setFormData }) => {
  const editorRef = useRef(null);

  // ✅ Local states for content fields (Removed faqsContent)
  const [aboutContent, setAboutContent] = useState("");
  const [eligibilityContent, setEligibilityContent] = useState("");
  const [facilitiesContent, setFacilitiesContent] = useState("");
  const [scholarshipContent, setScholarshipContent] = useState("");
  const [priority, setPriority] = useState(""); // ✅ Added Priority Field

  // ✅ Sync form data when editing (Removed faqs from dependencies)
  useEffect(() => {
    setAboutContent(formData.about || "");
    setEligibilityContent(formData.eligibility || "");
    setFacilitiesContent(formData.facilities_features || "");
    setScholarshipContent(formData.scholarship || "");
    setPriority(formData.priority || ""); // ✅ Load priority from formData
  }, [
    formData.about,
    formData.eligibility,
    formData.facilities_features,
    formData.scholarship,
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
        <JoditEditor
          ref={editorRef}
          value={aboutContent}
          tabIndex={1}
          onBlur={(newContent) => {
            setAboutContent(newContent);
            setFormData((prev) => ({ ...prev, about: newContent }));
          }}
        />
      </div>

      {/* Eligibility Criteria */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Eligibility Criteria</label>
        <JoditEditor
          ref={editorRef}
          value={eligibilityContent}
          tabIndex={1}
          onBlur={(newContent) => {
            setEligibilityContent(newContent);
            setFormData((prev) => ({ ...prev, eligibility: newContent }));
          }}
        />
      </div>

      {/* Facilities & Features */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">University Facilities</label>
        <JoditEditor
          ref={editorRef}
          value={facilitiesContent}
          tabIndex={1}
          onBlur={(newContent) => {
            setFacilitiesContent(newContent);
            setFormData((prev) => ({ ...prev, facilities_features: newContent }));
          }}
        />
      </div>

      {/* Scholarships */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Scholarships Offered</label>
        <JoditEditor
          ref={editorRef}
          value={scholarshipContent}
          tabIndex={1}
          onBlur={(newContent) => {
            setScholarshipContent(newContent);
            setFormData((prev) => ({ ...prev, scholarship: newContent }));
          }}
        />
      </div>
    </div>
  );
};

export default UniversityAbout;