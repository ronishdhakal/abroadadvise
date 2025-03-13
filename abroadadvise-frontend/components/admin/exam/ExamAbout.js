"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import TinyMCE to prevent SSR issues
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
});

const ExamAbout = ({ formData, setFormData }) => {
  // ✅ Local states to track editor content
  const [shortDescription, setShortDescription] = useState("");
  const [aboutExam, setAboutExam] = useState("");
  const [examCenters, setExamCenters] = useState("");

  // ✅ Sync initial form data when editing an exam
  useEffect(() => {
    setShortDescription(formData.short_description || "");
    setAboutExam(formData.about || "");
    setExamCenters(formData.exam_centers || "");
  }, [formData]);

  // ✅ Common TinyMCE Configuration (Full Toolbar)
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Exam About & Centers</h2>

      {/* ✅ Short Description */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Short Description:</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={shortDescription}
          init={editorConfig}
          onEditorChange={(content) => {
            setShortDescription(content);
            setFormData((prev) => ({ ...prev, short_description: content }));
          }}
        />
      </div>

      {/* ✅ About Exam */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">About Exam:</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={aboutExam}
          init={editorConfig}
          onEditorChange={(content) => {
            setAboutExam(content);
            setFormData((prev) => ({ ...prev, about: content }));
          }}
        />
      </div>

      {/* ✅ Exam Centers */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Exam Centers:</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={examCenters}
          init={editorConfig}
          onEditorChange={(content) => {
            setExamCenters(content);
            setFormData((prev) => ({ ...prev, exam_centers: content }));
          }}
        />
      </div>
    </div>
  );
};

export default ExamAbout;
