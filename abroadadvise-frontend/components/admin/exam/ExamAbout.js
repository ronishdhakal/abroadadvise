"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import JoditEditor to prevent SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const ExamAbout = ({ formData, setFormData }) => {
  const editorRef = useRef(null);

  const [shortDescription, setShortDescription] = useState("");
  const [aboutExam, setAboutExam] = useState("");
  const [examCenters, setExamCenters] = useState("");

  // ✅ Sync initial form data when editing an exam
  useEffect(() => {
    setShortDescription(formData.short_description || "");
    setAboutExam(formData.about || "");
    setExamCenters(formData.exam_centers || "");
  }, [formData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Exam About & Centers</h2>

      {/* ✅ Short Description */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Short Description:</label>
        <JoditEditor
          ref={editorRef}
          value={shortDescription}
          tabIndex={1}
          onBlur={(newContent) => {
            setShortDescription(newContent);
            setFormData((prev) => ({ ...prev, short_description: newContent }));
          }}
        />
      </div>

      {/* ✅ About Exam */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">About Exam:</label>
        <JoditEditor
          ref={editorRef}
          value={aboutExam}
          tabIndex={1}
          onBlur={(newContent) => {
            setAboutExam(newContent);
            setFormData((prev) => ({ ...prev, about: newContent }));
          }}
        />
      </div>

      {/* ✅ Exam Centers */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Exam Centers:</label>
        <JoditEditor
          ref={editorRef}
          value={examCenters}
          tabIndex={1}
          onBlur={(newContent) => {
            setExamCenters(newContent);
            setFormData((prev) => ({ ...prev, exam_centers: newContent }));
          }}
        />
      </div>
    </div>
  );
};

export default ExamAbout;
