"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const InquiryModal = ({
  consultancyId,
  consultancyName,
  entityId,
  entityName,
  entityType,
  universityId,
  universityName,
  isModalOpen,
  setIsModalOpen,
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    entity_type: entityType || "",
    entity_id: entityId || null,
    consultancy_id: consultancyId || null,
    consultancy_name: consultancyName || "",
    university_id: universityId || null,
    university_name: universityName || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      console.log("🔄 Updating Inquiry Data:", {
        entityType,
        entityId,
        consultancyId,
        consultancyName,
        universityId,
        universityName,
      });

      setInquiryData((prevData) => ({
        ...prevData,
        entity_type: entityType || prevData.entity_type,
        entity_id: entityId || prevData.entity_id,
        consultancy_id: consultancyId || prevData.consultancy_id,
        consultancy_name: consultancyName || prevData.consultancy_name,
        university_id: universityId || prevData.university_id,
        university_name: universityName || prevData.university_name,
      }));
    }
  }, [isModalOpen, entityType, entityId, consultancyId, consultancyName, universityId, universityName]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, setIsModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage(null);

    if (!inquiryData.entity_type || !inquiryData.entity_id) {
      setSubmissionMessage("Inquiry type or entity is missing. Please try again.");
      setIsSubmitting(false);
      return;
    }

    console.log("📤 Submitting Inquiry:", inquiryData);

    try {
      const response = await fetch(`${API_URL}/inquiry/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit inquiry.");
      }

      setIsSuccess(true);
      setSubmissionMessage("Inquiry sent successfully!");

      setInquiryData((prevData) => ({
        ...prevData,
        name: "",
        email: "",
        phone: "",
        message: "",
      }));

      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      setIsSuccess(false);
      setSubmissionMessage(error.message || "Failed to send inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-black">
          Apply for <span className="text-[#4c9bd5]">{entityName || "this opportunity"}</span>
        </h2>

        {universityName && (
          <p className="text-sm text-center text-gray-600 mb-2">
            Inquiry related to <strong>{universityName}</strong>
          </p>
        )}

        {submissionMessage && (
          <p className={`text-sm text-center ${isSuccess ? "text-green-600" : "text-red-600"} mb-2`}>
            {submissionMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={inquiryData.name}
            onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
            className="w-full p-2 border rounded-lg text-black"
            required
            aria-label="Your Name"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={inquiryData.email}
            onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
            className="w-full p-2 border rounded-lg text-black"
            required
            aria-label="Your Email"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone"
            value={inquiryData.phone}
            onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
            className="w-full p-2 border rounded-lg text-black"
            aria-label="Your Phone"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={inquiryData.message}
            onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
            className="w-full p-2 border rounded-lg text-black"
            rows="4"
            required
            aria-label="Your Message"
          />
          <button
            type="submit"
            className="w-full bg-[#4c9bd5] text-white py-2 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Send Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
