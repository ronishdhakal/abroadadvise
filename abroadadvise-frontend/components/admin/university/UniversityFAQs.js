"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

const UniversityFAQs = ({ formData, setFormData }) => {
  const [faqs, setFaqs] = useState(formData.faqs || [{ question: "", answer: "" }]);

  // ✅ Sync faqs with formData on mount or when formData changes
  useEffect(() => {
    setFaqs(formData.faqs && formData.faqs.length > 0 ? formData.faqs : [{ question: "", answer: "" }]);
  }, [formData.faqs]);

  // ✅ Handle FAQ Input Changes
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  // ✅ Add New FAQ
  const addFaq = () => {
    const updatedFaqs = [...faqs, { question: "", answer: "" }];
    setFaqs(updatedFaqs);
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  // ✅ Remove FAQ
  const removeFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs.length ? updatedFaqs : [{ question: "", answer: "" }]);
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs.length ? updatedFaqs : [{ question: "", answer: "" }] }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

      {faqs.map((faq, index) => (
        <div
          key={index}
          className="mb-4 bg-gray-50 p-4 border border-gray-200 rounded-lg space-y-3"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <input
              type="text"
              value={faq.question}
              onChange={(e) => handleFaqChange(index, "question", e.target.value)}
              placeholder="Enter question"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Answer</label>
            <textarea
              value={faq.answer}
              onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
              placeholder="Enter answer"
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5]"
            />
          </div>
          {faqs.length > 1 && (
            <button
              type="button"
              onClick={() => removeFaq(index)}
              className="text-red-500 text-sm flex items-center gap-1 hover:underline"
            >
              <Trash2 className="w-4 h-4" /> Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addFaq}
        className="text-[#4c9bd5] font-medium text-sm flex items-center gap-2 hover:underline mt-2"
      >
        <PlusCircle className="w-5 h-5" /> Add New FAQ
      </button>
    </div>
  );
};

export default UniversityFAQs;