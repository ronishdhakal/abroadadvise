"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";

const UniversityFAQs = ({ formData, setFormData }) => {
  const [faqs, setFaqs] = useState(formData.faqs || []);

  // ✅ Handle FAQ Input Changes
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  // ✅ Add New FAQ
  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  // ✅ Remove FAQ
  const removeFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

      {faqs.length > 0 ? (
        faqs.map((faq, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm">
            {/* Question Field */}
            <label className="block text-gray-700 font-medium mb-1">Question</label>
            <input
              type="text"
              value={faq.question}
              onChange={(e) => handleFaqChange(index, "question", e.target.value)}
              placeholder="Enter question"
              className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
            />

            {/* Answer Field */}
            <label className="block text-gray-700 font-medium mt-3 mb-1">Answer</label>
            <textarea
              value={faq.answer}
              onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
              placeholder="Enter answer"
              className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300 h-24"
            ></textarea>

            {/* Remove FAQ Button */}
            <button
              onClick={() => removeFaq(index)}
              className="mt-3 bg-red-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              <Trash className="w-4 h-4 inline-block mr-1" />
              Remove FAQ
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No FAQs added yet.</p>
      )}

      {/* Add FAQ Button */}
      <button
        onClick={addFaq}
        className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add FAQ
      </button>
    </div>
  );
};

export default UniversityFAQs;
