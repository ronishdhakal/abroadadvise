"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { updateConsultancyDashboard } from "@/utils/api";

// ✅ Dynamically import JoditEditor to prevent SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const ConsultancyAbout = ({ formData, setFormData }) => {
  const editorRef = useRef(null);
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
      updateData.append("about", aboutContent);
      updateData.append("services", servicesContent);

      await updateConsultancyDashboard(updateData);

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
        <p className="text-gray-500 italic">Consultancy data not available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">About & Services</h2>

      {/* About Section */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">About Consultancy</label>
        <JoditEditor
          ref={editorRef}
          value={aboutContent}
          tabIndex={1}
          onBlur={(newContent) => setAboutContent(newContent)}
        />
      </div>

      {/* Services Section */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Our Services</label>
        <JoditEditor
          ref={editorRef}
          value={servicesContent}
          tabIndex={1}
          onBlur={(newContent) => setServicesContent(newContent)}
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

export default ConsultancyAbout;
