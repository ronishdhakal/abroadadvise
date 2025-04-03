"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const ScholarshipDetail = ({ formData, setFormData }) => {
  const editorRef = useRef(null);
  const [detailContent, setDetailContent] = useState("");

  useEffect(() => {
    setDetailContent(formData.detail || "");
  }, [formData.detail]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Scholarship Description</h2>

      <JoditEditor
        ref={editorRef}
        value={detailContent}
        tabIndex={1}
        onBlur={(content) => {
          setDetailContent(content);
          setFormData((prev) => ({ ...prev, detail: content }));
        }}
      />

      {/* ✅ Is Published Checkbox */}
      <div className="mt-6 flex items-center">
        <input
          type="checkbox"
          id="is_published"
          name="is_published"
          checked={formData.is_published || false}
          onChange={handleCheckboxChange}
          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border border-gray-300 rounded"
        />
        <label htmlFor="is_published" className="text-gray-700 font-medium">
          Published
        </label>
      </div>
    </div>
  );
};

export default ScholarshipDetail;
