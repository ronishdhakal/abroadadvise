"use client";

import { useEffect, useState, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react"; // ✅ TinyMCE Rich Text Editor

const CourseAbout = ({ formData, setFormData }) => {
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

  // ✅ TinyMCE Configuration
  const editorConfig = {
    height: 250,
    menubar: false,
    plugins: "advlist autolink lists link image charmap preview anchor table",
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Details</h2>

      {/* ✅ About the Course (Short Description) */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Short Description *</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={content.short_description}
          onEditorChange={(newContent) => handleEditorChange("short_description", newContent)}
          init={editorConfig}
        />
      </div>

      {/* ✅ Eligibility Criteria */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Eligibility Criteria *</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={content.eligibility}
          onEditorChange={(newContent) => handleEditorChange("eligibility", newContent)}
          init={editorConfig}
        />
      </div>

      {/* ✅ Course Structure */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Course Structure</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={content.course_structure}
          onEditorChange={(newContent) => handleEditorChange("course_structure", newContent)}
          init={editorConfig}
        />
      </div>

      {/* ✅ Career Opportunities */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Career Opportunities</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={content.job_prospects}
          onEditorChange={(newContent) => handleEditorChange("job_prospects", newContent)}
          init={editorConfig}
        />
      </div>

      {/* ✅ Course Features */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Key Features</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={content.features}
          onEditorChange={(newContent) => handleEditorChange("features", newContent)}
          init={editorConfig}
        />
      </div>

      {/* ✅ Scholarship Information */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Scholarships Offered</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={content.scholarship}
          onEditorChange={(newContent) => handleEditorChange("scholarship", newContent)}
          init={editorConfig}
        />
      </div>
    </div>
  );
};

export default CourseAbout;
