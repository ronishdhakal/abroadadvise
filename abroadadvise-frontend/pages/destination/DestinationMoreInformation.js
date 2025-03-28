"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const DestinationMoreInformation = ({ destination }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderFAQs = () => {
    try {
      const parsedFaqs = JSON.parse(destination?.faqs || "[]");
      if (!Array.isArray(parsedFaqs) || parsedFaqs.length === 0) return null;

      return (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {parsedFaqs.map((faq, index) => {
              const isOpen = openIndexes.includes(index);
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden transition-all"
                >
                  {/* Question */}
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

                  {/* Answer */}
                  {isOpen && (
                    <div className="px-4 py-3 text-sm text-gray-700 bg-white border-t border-gray-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    } catch (error) {
      console.warn("Invalid FAQ JSON for destination:", error);
      return null;
    }
  };

  if (!destination?.more_information || destination.more_information.trim() === "") {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto mt-8">
      {/* More Information */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        More Information about {destination.title}
      </h2>

      <div
        className="prose prose-blue text-gray-800"
        dangerouslySetInnerHTML={{ __html: destination.more_information }}
      />

      {/* FAQs */}
      {renderFAQs()}
    </div>
  );
};

export default DestinationMoreInformation;
