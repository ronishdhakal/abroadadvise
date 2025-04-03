"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const CourseAbout = ({ formData, setFormData }) => {
  const editorRef = useRef(null);

  // ✅ Local states for content fields
  const [content, setContent] = useState({
    short_description: "",
    eligibility: "",
    course_structure: "",
    job_prospects: "",
    features: "",
    scholarship: "",
  });

  // ✅ Sync form data when editing
  useEffect(() => {
    setContent({
      short_description: formData.short_description || "",
      eligibility: formData.eligibility || "",
      course_structure: formData.course_structure || "",
      job_prospects: formData.job_prospects || "",
      features: formData.features || "",
      scholarship: formData.scholarship || "",
    });
  }, [formData]);

  // ✅ Prevent infinite re-renders by using `useCallback`
  const handleEditorChange = useCallback(
    (field, contentValue) => {
      setContent((prev) => ({ ...prev, [field]: contentValue }));

      // Update formData only when the content changes
      setFormData((prev) => {
        if (prev[field] !== contentValue) {
          return { ...prev, [field]: contentValue };
        }
        return prev;
      });
    },
    [setFormData]
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Details</h2>

      {/* ✅ About the Course (Short Description) */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Short Description *</label>
        <JoditEditor
          ref={editorRef}
          value={content.short_description}
          tabIndex={1}
          onBlur={(newContent) => handleEditorChange("short_description", newContent)}
        />
      </div>

      {/* ✅ Eligibility Criteria */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Eligibility Criteria *</label>
        <JoditEditor
          ref={editorRef}
          value={content.eligibility}
          tabIndex={1}
          onBlur={(newContent) => handleEditorChange("eligibility", newContent)}
        />
      </div>

      {/* ✅ Course Structure */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Course Structure</label>
        <JoditEditor
          ref={editorRef}
          value={content.course_structure}
          tabIndex={1}
          onBlur={(newContent) => handleEditorChange("course_structure", newContent)}
        />
      </div>

      {/* ✅ Career Opportunities */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Career Opportunities</label>
        <JoditEditor
          ref={editorRef}
          value={content.job_prospects}
          tabIndex={1}
          onBlur={(newContent) => handleEditorChange("job_prospects", newContent)}
        />
      </div>

      {/* ✅ Course Features */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Key Features</label>
        <JoditEditor
          ref={editorRef}
          value={content.features}
          tabIndex={1}
          onBlur={(newContent) => handleEditorChange("features", newContent)}
        />
      </div>

      {/* ✅ Scholarship Information */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Scholarships Offered</label>
        <JoditEditor
          ref={editorRef}
          value={content.scholarship}
          tabIndex={1}
          onBlur={(newContent) => handleEditorChange("scholarship", newContent)}
        />
      </div>
    </div>
  );
};

export default CourseAbout;