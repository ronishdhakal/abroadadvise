"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// ✅ Dynamically import TinyMCE
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
});

const EventAbout = ({ formData, setFormData }) => {
  const [editorContent, setEditorContent] = useState({
    description: formData.description || "",
  });

  // ✅ Handle TinyMCE change
  const handleEditorChange = (name, content) => {
    setEditorContent((prev) => ({ ...prev, [name]: content }));
    setFormData((prev) => ({ ...prev, [name]: content }));
  };

  // ✅ Handle Priority input change
  const handlePriorityChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setFormData((prev) => ({ ...prev, priority: value }));
  };

  // ✅ Sync local state when editing
  useEffect(() => {
    setEditorContent({
      description: formData.description || "",
    });
  }, [formData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Event Description & Priority</h2>

      {/* ✅ Description (TinyMCE Rich Text) */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">Event Description:</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={editorContent.description}
          init={{
            height: 300,
            menubar: false,
            plugins: "advlist autolink lists link image charmap preview anchor table",
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
          }}
          onEditorChange={(content) => handleEditorChange("description", content)}
        />
      </div>

      
    </div>
  );
};

export default EventAbout;
