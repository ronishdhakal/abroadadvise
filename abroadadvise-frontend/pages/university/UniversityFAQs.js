"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const UniversityFAQs = ({ university = {} }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  let parsedFaqs = [];

  try {
    parsedFaqs = JSON.parse(university?.faqs || "[]");
  } catch (error) {
    console.warn("Invalid FAQ JSON:", error);
  }

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl mx-auto mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>

      {parsedFaqs.length > 0 ? (
        <div className="space-y-4">
          {parsedFaqs.map((faq, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                >
                  <span className="text-sm font-medium text-[#4c9bd5]">
                    Q{index + 1}: {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-[#4c9bd5]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#4c9bd5]" />
                  )}
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-4 py-3 text-sm text-gray-700 bg-white border-t border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No FAQs listed for this university.</p>
      )}
    </div>
  );
};

export default UniversityFAQs;
