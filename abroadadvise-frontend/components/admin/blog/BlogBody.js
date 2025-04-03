"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const BlogBody = ({ formData, setFormData }) => {
  const editorRef = useRef(null);

  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    setContent(formData.content || "");
    setPriority(formData.priority || "");
    setIsPublished(formData.is_published ?? true);
  }, [formData.content, formData.priority, formData.is_published]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Blog Content & Settings</h2>

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

      {/* ✅ Blog Content Editor */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Blog Content</label>
        <JoditEditor
          ref={editorRef}
          value={content}
          tabIndex={1}
          onBlur={(newContent) => {
            setContent(newContent);
            setFormData((prev) => ({ ...prev, content: newContent }));
          }}
        />
      </div>

      {/* ✅ Publish Toggle */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Publish Blog</label>
        <select
          value={isPublished ? "true" : "false"}
          onChange={(e) => {
            const value = e.target.value === "true";
            setIsPublished(value);
            setFormData((prev) => ({ ...prev, is_published: value }));
          }}
          className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
        >
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>
    </div>
  );
};

export default BlogBody;
