"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

// ✅ Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EventAbout = ({ formData, setFormData }) => {
  const editorRef = useRef(null);

  const [editorContent, setEditorContent] = useState({
    description: formData.description || "",
  });

  // ✅ Handle Jodit change
  const handleEditorChange = (name, content) => {
    setEditorContent((prev) => ({ ...prev, [name]: content }));
    setFormData((prev) => ({ ...prev, [name]: content }));
  };

  // ✅ Handle Priority input change
  const handlePriorityChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setFormData((prev) => ({ ...prev, priority: value }));
  };

  // ✅ Handle Registration Link change
  const handleRegistrationLinkChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, registration_link: value }));
  };

  // ✅ Sync local state when editing
  useEffect(() => {
    setEditorContent({
      description: formData.description || "",
    });
  }, [formData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Event Description, Link & Priority</h2>

      {/* ✅ Description (Jodit Rich Text) */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">Event Description:</label>
        <JoditEditor
          ref={editorRef}
          value={editorContent.description}
          tabIndex={1}
          onBlur={(content) => handleEditorChange("description", content)}
        />
      </div>

      {/* ✅ Registration Link */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">Registration Link (optional):</label>
        <input
          type="url"
          placeholder="https://example.com/register"
          value={formData.registration_link || ""}
          onChange={handleRegistrationLinkChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* ✅ Priority */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Priority (lower = higher priority):</label>
        <input
          type="number"
          min={1}
          placeholder="e.g. 1"
          value={formData.priority || ""}
          onChange={handlePriorityChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default EventAbout;
