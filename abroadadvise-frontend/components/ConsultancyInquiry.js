"use client";

import { useState } from "react";
import { X } from "lucide-react";

const ConsultancyInquiry = ({ consultancyId, consultancyName, isModalOpen, setIsModalOpen }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage(null);

    if (!inquiryData.name || !inquiryData.email || !inquiryData.message) {
      setSubmissionMessage("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/inquiry/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone,
          message: inquiryData.message,
          entity_type: "consultancy",
          entity_id: consultancyId,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to submit inquiry.");
        } else {
          throw new Error("Unexpected response format (HTML received)");
        }
      }

      setIsSuccess(true);
      setSubmissionMessage("Inquiry sent successfully!");
      setInquiryData({ name: "", email: "", phone: "", message: "" });

      // ✅ Auto-close modal on success
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Inquiry Submission Error:", error);
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
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-black">
          {consultancyName} Inquiry
        </h2>

        {submissionMessage && (
          <p
            className={`text-sm text-center ${
              isSuccess ? "text-green-600" : "text-red-600"
            } mb-2`}
          >
            {submissionMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={inquiryData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-black"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={inquiryData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-black"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone"
            value={inquiryData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-black"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={inquiryData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-black"
            rows="4"
            required
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

export default ConsultancyInquiry;
