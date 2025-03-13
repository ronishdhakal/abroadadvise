"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import TinyMCE to prevent SSR issues
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
});

const DestinationAbout = ({ formData, setFormData }) => {
  // ✅ Local states to track editor content
  const [whyChoose, setWhyChoose] = useState("");
  const [requirements, setRequirements] = useState("");
  const [documentsRequired, setDocumentsRequired] = useState("");
  const [scholarships, setScholarships] = useState("");
  const [moreInformation, setMoreInformation] = useState("");
  const [faqs, setFaqs] = useState("");

  // ✅ Sync initial form data when editing a destination
  useEffect(() => {
    setWhyChoose(formData.why_choose || "");
    setRequirements(formData.requirements || "");
    setDocumentsRequired(formData.documents_required || "");
    setScholarships(formData.scholarships || "");
    setMoreInformation(formData.more_information || "");
    setFaqs(formData.faqs || "");
  }, [formData]);

  // ✅ Common TinyMCE Configuration
  const editorConfig = {
    height: 250,
    menubar: false,
    plugins:
      "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help",
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image media | preview code fullscreen",
    content_style: "body { font-family:Arial,sans-serif; font-size:14px }",
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Destination Details</h2>

      {/* ✅ Why Choose This Destination */}
      <div className="mb-4">
        <label className="block text-gray-700">Why Choose This Destination?</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={whyChoose}
          init={editorConfig}
          onEditorChange={(content) => {
            setWhyChoose(content);
            setFormData((prev) => ({ ...prev, why_choose: content }));
          }}
        />
      </div>

      {/* ✅ Requirements */}
      <div className="mb-4">
        <label className="block text-gray-700">Requirements</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={requirements}
          init={editorConfig}
          onEditorChange={(content) => {
            setRequirements(content);
            setFormData((prev) => ({ ...prev, requirements: content }));
          }}
        />
      </div>

      {/* ✅ Required Documents */}
      <div className="mb-4">
        <label className="block text-gray-700">Required Documents</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={documentsRequired}
          init={editorConfig}
          onEditorChange={(content) => {
            setDocumentsRequired(content);
            setFormData((prev) => ({ ...prev, documents_required: content }));
          }}
        />
      </div>

      {/* ✅ Scholarships */}
      <div className="mb-4">
        <label className="block text-gray-700">Scholarships</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={scholarships}
          init={editorConfig}
          onEditorChange={(content) => {
            setScholarships(content);
            setFormData((prev) => ({ ...prev, scholarships: content }));
          }}
        />
      </div>

      {/* ✅ More Information */}
      <div className="mb-4">
        <label className="block text-gray-700">More Information</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={moreInformation}
          init={editorConfig}
          onEditorChange={(content) => {
            setMoreInformation(content);
            setFormData((prev) => ({ ...prev, more_information: content }));
          }}
        />
      </div>

      {/* ✅ FAQs */}
      <div className="mb-4">
        <label className="block text-gray-700">FAQs</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={faqs}
          init={editorConfig}
          onEditorChange={(content) => {
            setFaqs(content);
            setFormData((prev) => ({ ...prev, faqs: content }));
          }}
        />
      </div>
    </div>
  );
};

export default DestinationAbout;
