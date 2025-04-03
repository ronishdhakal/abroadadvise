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

  // ✅ Sync local state when editing
  useEffect(() => {
    setEditorContent({
      description: formData.description || "",
    });
  }, [formData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Event Description & Priority</h2>

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
    </div>
  );
};

export default EventAbout;
