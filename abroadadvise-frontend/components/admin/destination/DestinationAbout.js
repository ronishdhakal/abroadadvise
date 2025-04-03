"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { PlusCircle, Trash2 } from "lucide-react";

// Dynamically import JoditEditor to prevent SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const DestinationAbout = ({ formData, setFormData }) => {
  const editorRef = useRef(null);

  const [whyChoose, setWhyChoose] = useState("");
  const [requirements, setRequirements] = useState("");
  const [documentsRequired, setDocumentsRequired] = useState("");
  const [scholarships, setScholarships] = useState("");
  const [moreInformation, setMoreInformation] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  useEffect(() => {
    setWhyChoose(formData.why_choose || "");
    setRequirements(formData.requirements || "");
    setDocumentsRequired(formData.documents_required || "");
    setScholarships(formData.scholarships || "");
    setMoreInformation(formData.more_information || "");

    try {
      const parsed = JSON.parse(formData.faqs);
      setFaqs(Array.isArray(parsed) ? parsed : [{ question: "", answer: "" }]);
    } catch {
      setFaqs([{ question: "", answer: "" }]);
    }
  }, [formData]);

  const handleFaqChange = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
    setFormData((prev) => ({ ...prev, faqs: JSON.stringify(updated) }));
  };

  const addFaq = () => {
    const updated = [...faqs, { question: "", answer: "" }];
    setFaqs(updated);
    setFormData((prev) => ({ ...prev, faqs: JSON.stringify(updated) }));
  };

  const removeFaq = (index) => {
    const updated = faqs.filter((_, i) => i !== index);
    setFaqs(updated.length ? updated : [{ question: "", answer: "" }]);
    setFormData((prev) => ({ ...prev, faqs: JSON.stringify(updated) }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Destination Details</h2>

      {[
        { label: "Why Choose This Destination?", value: whyChoose, set: setWhyChoose, key: "why_choose" },
        { label: "Requirements", value: requirements, set: setRequirements, key: "requirements" },
        { label: "Required Documents", value: documentsRequired, set: setDocumentsRequired, key: "documents_required" },
        { label: "Scholarships", value: scholarships, set: setScholarships, key: "scholarships" },
        { label: "More Information", value: moreInformation, set: setMoreInformation, key: "more_information" },
      ].map(({ label, value, set, key }, idx) => (
        <div key={idx}>
          <label className="block text-gray-700 font-medium mb-1">{label}</label>
          <JoditEditor
            ref={editorRef}
            value={value}
            tabIndex={1}
            onBlur={(newContent) => {
              set(newContent);
              setFormData((prev) => ({ ...prev, [key]: newContent }));
            }}
          />
        </div>
      ))}

      {/* FAQs Section */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2 text-lg">FAQs</label>
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
    </div>
  );
};

export default DestinationAbout;