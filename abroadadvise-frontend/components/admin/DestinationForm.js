import { useState, useEffect } from "react";
import DestinationHeader from "./destination/DestinationHeader";
import DestinationAbout from "./destination/DestinationAbout";
import { createDestination, updateDestination } from "@/utils/api";

const DestinationForm = ({ destinationSlug, destinationData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    country_logo: null,
    cover_page: null,
    why_choose: "",
    requirements: "",
    documents_required: "",
    scholarships: "",
    more_information: "",
    faqs: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize formData with destinationData when it changes
  useEffect(() => {
    if (destinationData) {
      setFormData({
        title: destinationData?.title || "",
        slug: destinationData?.slug || "",
        country_logo: destinationData?.country_logo || null,
        cover_page: destinationData?.cover_page || null,
        why_choose: destinationData?.why_choose || "",
        requirements: destinationData?.requirements || "",
        documents_required: destinationData?.documents_required || "",
        scholarships: destinationData?.scholarships || "",
        more_information: destinationData?.more_information || "",
        faqs: destinationData?.faqs || "",
      });
    }
  }, [destinationData]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes (For images)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();

    // Append all text fields to formData
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]); // Append new file (images)
        } else {
          formDataToSend.append(key, formData[key]); // Append text fields
        }
      }
    });

    try {
      let response;
      if (destinationSlug) {
        response = await updateDestination(destinationSlug, formDataToSend); // Update destination
      } else {
        response = await createDestination(formDataToSend); // Create new destination
      }
      console.log("✅ Destination Saved Successfully:", response);
      onSuccess();
    } catch (err) {
      console.error("❌ Error submitting destination:", err);
      setError(err.message || "An error occurred while saving the destination.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Destination Header */}
      <DestinationHeader formData={formData} onChange={handleChange} onFileChange={handleFileChange} />

      {/* Destination About */}
      <DestinationAbout formData={formData} onChange={handleChange} />

      {/* Submit & Cancel Buttons */}
      <div className="flex gap-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Saving..." : destinationSlug ? "Update Destination" : "Create Destination"}
        </button>
        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default DestinationForm;
