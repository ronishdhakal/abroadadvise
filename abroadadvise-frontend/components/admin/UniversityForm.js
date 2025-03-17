"use client";

import { useState, useEffect } from "react";
import { createUniversity, updateUniversity, fetchUniversityDetails } from "@/utils/api";

import UniversityHeader from "./university/UniversityHeader";
import UniversityContact from "./university/UniversityContact";
import UniversityAbout from "./university/UniversityAbout";
import UniversityDisciplines from "./university/UniversityDisciplines";

const UniversityForm = ({ universitySlug, onSuccess, onCancel }) => {
  const isEditing = !!universitySlug;

  // ✅ Define initial form state (Disciplines Array Added)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    country: "",
    priority: "",
    eligibility: "",
    facilities_features: "",
    scholarship: "",
    tuition_fees: "",
    about: "",
    faqs: [], // ✅ Correct
    logo: null,
    brochure: null,
    cover_photo: null,
    type: "",
    disciplines: [], // ✅ Initialize disciplines as an empty array
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Load university data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchUniversityDetails(universitySlug)
        .then((data) => {
          console.log("✅ Fetched University Data:", data);

          setFormData((prev) => ({
            ...prev,
            ...data,
            logo: data.logo || prev.logo,
            cover_photo: data.cover_photo || prev.cover_photo,
            brochure: data.brochure || prev.brochure,
            disciplines: data.disciplines?.map((item) => Number(item.id)) || [], // updated code
            faqs: Array.isArray(data.faqs) ? data.faqs : [], // ✅ Ensure `faqs` is an array
          }));
        })
        .catch(() => setError("❌ Failed to load university details"))
        .finally(() => setLoading(false));
    }
  }, [isEditing, universitySlug]);

  // ✅ Automatically generate slug only if empty
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  // Handle add faqs
  const handleAddFaq = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      faqs: [...prevFormData.faqs, { question: "", answer: "" }],
    }));
  };
  // Handle faqs data
  const handleFaqChange = (index, key, value) => {
    setFormData((prevFormData) => {
      const newFaqs = [...prevFormData.faqs];
      newFaqs[index][key] = value;
      return { ...prevFormData, faqs: newFaqs };
    });
  };

  // Remove faqs data
  const handleRemoveFaq = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      faqs: prevFormData.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const submissionData = new FormData();

      // ✅ Append all text fields
      [
        "name",
        "email",
        "website",
        "phone",
        "address",
        "country",
        "priority",
        "eligibility",
        "facilities_features",
        "scholarship",
        "tuition_fees",
        "about",
        "type",
      ].forEach((field) => {
        if (formData[field]) submissionData.append(field, formData[field]);
      });
        
      // Add disciplines data
        if (formData.disciplines) {
          submissionData.append("disciplines", JSON.stringify(formData.disciplines)) // updated code
        }

      submissionData.append("faqs", JSON.stringify(formData.faqs));

      // ✅ Handle Logo, Brochure & Cover Image Uploads
      if (formData.logo instanceof File) submissionData.append("logo", formData.logo);
      if (formData.cover_photo instanceof File) submissionData.append("cover_photo", formData.cover_photo);
      if (formData.brochure instanceof File) submissionData.append("brochure", formData.brochure);

      console.log("🚀 Submitting University Data:", Object.fromEntries(submissionData.entries()));

      if (isEditing) {
        await updateUniversity(universitySlug, submissionData);
        setSuccessMessage("✅ University updated successfully!");
      } else {
        await createUniversity(submissionData);
        setSuccessMessage("✅ University created successfully!");
      }

      onSuccess();
    } catch (error) {
      setError(error.message || "❌ Failed to submit university. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit University" : "Create University"}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* University Header */}
        <UniversityHeader formData={formData} setFormData={setFormData} />

        {/* Contact Information */}
        <UniversityContact formData={formData} setFormData={setFormData} />

        {/* About & Additional Information */}
        <UniversityAbout formData={formData} setFormData={setFormData} />

        {/* Disciplines */}
        <div className="mt-4">
          <UniversityDisciplines formData={formData} setFormData={setFormData} />
        </div>

        {/* Add Faqs field */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions (FAQs)
          </h2>
          {Array.isArray(formData.faqs) && formData.faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <div className="mb-2">
                <label
                  htmlFor={`faq-question-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  id={`faq-question-${index}`}
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter question"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor={`faq-answer-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Answer {index + 1}
                </label>
                <textarea
                  id={`faq-answer-${index}`}
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter answer"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFaq(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFaq}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add FAQ
          </button>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <button type="button" className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UniversityForm;
