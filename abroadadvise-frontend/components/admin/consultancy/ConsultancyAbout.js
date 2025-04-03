"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const ConsultancyAbout = ({ formData, setFormData }) => {
  const editorRef = useRef(null);

  const [aboutContent, setAboutContent] = useState("");
  const [servicesContent, setServicesContent] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    setAboutContent(formData.about || "");
    setServicesContent(formData.services || "");
    setPriority(formData.priority || "");
  }, [formData.about, formData.services, formData.priority]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">About & Services</h2>

      {/* Priority Field */}
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

      {/* About Consultancy */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">About Consultancy</label>
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

      {/* Consultancy Services */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Our Services</label>
        <JoditEditor
          ref={editorRef}
          value={servicesContent}
          tabIndex={1}
          onBlur={(newContent) => {
            setServicesContent(newContent);
            setFormData((prev) => ({ ...prev, services: newContent }));
          }}
        />
      </div>
    </div>
  );
};

export default ConsultancyAbout;
