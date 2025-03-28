"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { updateUniversityDashboard } from "@/utils/api";
import { PlusCircle, Trash2 } from "lucide-react";

const UniversityAbout = ({ formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [aboutContent, setAboutContent] = useState("");
  const [eligibilityContent, setEligibilityContent] = useState("");
  const [facilitiesContent, setFacilitiesContent] = useState("");
  const [scholarshipContent, setScholarshipContent] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  useEffect(() => {
    if (!formData) return;
    setAboutContent(formData.about || "");
    setEligibilityContent(formData.eligibility || "");
    setFacilitiesContent(formData.facilities_features || "");
    setScholarshipContent(formData.scholarship || "");

    try {
      const parsedFaqs = JSON.parse(formData.faqs);
      setFaqs(Array.isArray(parsedFaqs) ? parsedFaqs : [{ question: "", answer: "" }]);
    } catch {
      setFaqs([{ question: "", answer: "" }]);
    }
  }, [formData]);

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
    setFormData((prev) => ({ ...prev, faqs: JSON.stringify(updatedFaqs) }));
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

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = new FormData();
      updateData.append("about", aboutContent);
      updateData.append("eligibility", eligibilityContent);
      updateData.append("facilities_features", facilitiesContent);
      updateData.append("scholarship", scholarshipContent);
      updateData.append("faqs", JSON.stringify(faqs));

      await updateUniversityDashboard(updateData);
      setSuccessMessage("University details updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  const editorConfig = {
    height: 300,
    menubar: false,
    plugins: "advlist autolink lists link image charmap preview anchor table",
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
    content_style: `
      body { font-family: 'Inter', sans-serif; font-size: 14px; color: #374151; }
      a { color: #4c9bd5; }
    `,
    skin: "oxide",
    content_css: "default",
  };

  if (!formData) {
    return (
      <div className="p-8 bg-white shadow-md rounded-2xl text-center text-gray-500 italic">
        Loading university details...
      </div>
    );
  }

  return (
    <div className="p-8 bg-white shadow-lg rounded-2xl w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">About & Details</h2>

      {/* Rich Text Sections */}
      {[
        { label: "About University", state: aboutContent, setState: setAboutContent, field: "about" },
        { label: "Eligibility Criteria", state: eligibilityContent, setState: setEligibilityContent, field: "eligibility" },
        { label: "University Facilities", state: facilitiesContent, setState: setFacilitiesContent, field: "facilities_features" },
        { label: "Scholarships Offered", state: scholarshipContent, setState: setScholarshipContent, field: "scholarship" },
      ].map(({ label, state, setState, field }, idx) => (
        <div className="mb-8" key={idx}>
          <label className="block text-gray-700 font-medium mb-2">{label}</label>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={state}
            onEditorChange={(content) => {
              setState(content);
              setFormData((prev) => ({ ...prev, [field]: content }));
            }}
            init={editorConfig}
          />
        </div>
      ))}

      {/* FAQs Section */}
      <div className="mb-8">
        <label className="block text-gray-700 font-medium mb-3 text-lg">Frequently Asked Questions (FAQs)</label>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5]"
                placeholder="Enter the question"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
              <textarea
                value={faq.answer}
                onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4c9bd5] focus:border-[#4c9bd5]"
                placeholder="Enter the answer"
                rows={3}
              />
            </div>
            {faqs.length > 1 && (
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="text-red-500 text-sm mt-2 flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-4 h-4" /> Remove FAQ
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addFaq}
          className="text-[#4c9bd5] font-medium text-sm flex items-center gap-2 hover:underline"
        >
          <PlusCircle className="w-5 h-5" />
          Add New FAQ
        </button>
      </div>

      {/* Update Button */}
      <div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Updating..." : "Update Details"}
        </button>
        {successMessage && <p className="mt-4 text-green-600 text-sm font-medium text-center">{successMessage}</p>}
        {error && <p className="mt-4 text-red-600 text-sm font-medium text-center">{error}</p>}
      </div>
    </div>
  );
};

export default UniversityAbout;
