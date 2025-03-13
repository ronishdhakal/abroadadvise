"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const ConsultancyAbout = ({ formData, setFormData }) => {
  // ✅ Local states to handle controlled editor values
  const [aboutContent, setAboutContent] = useState("");
  const [servicesContent, setServicesContent] = useState("");
  const [priority, setPriority] = useState(""); // ✅ Added Priority Field

  // ✅ Sync editor content with formData when editing
  useEffect(() => {
    setAboutContent(formData.about || "");
    setServicesContent(formData.services || "");
    setPriority(formData.priority || ""); // ✅ Load priority from formData
  }, [formData.about, formData.services, formData.priority]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">About & Services</h2>

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

      {/* About Consultancy */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">About Consultancy</label>
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

      {/* Consultancy Services */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Our Services</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={servicesContent}
          onEditorChange={(content) => {
            setServicesContent(content);
            setFormData((prev) => ({ ...prev, services: content }));
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

export default ConsultancyAbout;