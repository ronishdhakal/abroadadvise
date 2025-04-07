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
    next_intake: "",
    entry_score: "",
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
      next_intake: formData.next_intake || "",
      entry_score: formData.entry_score || "",
    });
  }, [formData]);

  // ✅ Prevent infinite re-renders by using `useCallback`
  const handleEditorChange = useCallback(
    (field, contentValue) => {
      setContent((prev) => ({ ...prev, [field]: contentValue }));
      setFormData((prev) => {
        if (prev[field] !== contentValue) {
          return { ...prev, [field]: contentValue };
        }
        return prev;
      });
    },
    [setFormData]
  );

  // ✅ Handle text field updates
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setContent((prev) => ({ ...prev, [name]: value }));
      setFormData((prev) => ({ ...prev, [name]: value }));
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

      {/* ✅ Next Intake (Text Input) */}
      <div className="mb-6">
        <label htmlFor="next_intake" className="block text-gray-700 font-medium mb-2">Next Intake</label>
        <input
          type="text"
          name="next_intake"
          id="next_intake"
          value={content.next_intake}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ✅ Entry Score (Text Input) */}
      <div className="mb-6">
        <label htmlFor="entry_score" className="block text-gray-700 font-medium mb-2">Entry Score</label>
        <input
          type="text"
          name="entry_score"
          id="entry_score"
          value={content.entry_score}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default CourseAbout;
