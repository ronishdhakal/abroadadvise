"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { updateCollegeDashboard } from "@/utils/api";

const CollegeAbout = ({ formData, setFormData }) => {
  const [aboutContent, setAboutContent] = useState("");
  const [servicesContent, setServicesContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (formData) {
      setAboutContent(formData.about || "");
      setServicesContent(formData.services || "");
    }
  }, [formData]);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      const updateData = new FormData();
  
      // 🔒 Preserve branches (safe field)
      if (formData.branches) {
        updateData.append("branches", JSON.stringify(formData.branches));
      }
  
      updateData.append("about", aboutContent);
      updateData.append("services", servicesContent);
  
      await updateCollegeDashboard(updateData);
  
      setFormData((prev) => ({
        ...prev,
        about: aboutContent,
        services: servicesContent,
      }));
  
      setSuccessMessage("About & Services updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update About & Services");
    } finally {
      setLoading(false);
    }
  };
  

  if (!formData) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <p className="text-gray-500 italic">College data not available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">About & Services</h2>

      {/* About Section */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">About College</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={aboutContent}
          onEditorChange={setAboutContent}
          init={{
            height: 250,
            menubar: false,
            plugins: "advlist autolink lists link image charmap preview anchor table",
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
          }}
        />
      </div>

      {/* Services Section */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Our Services</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={servicesContent}
          onEditorChange={setServicesContent}
          init={{
            height: 250,
            menubar: false,
            plugins: "advlist autolink lists link image charmap preview anchor table",
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
          }}
        />
      </div>

      {/* Update Button */}
      <div className="mt-6">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update About & Services"}
        </button>
      </div>

      {/* Status Messages */}
      {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default CollegeAbout;
