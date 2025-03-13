"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// ✅ Dynamically import TinyMCE to avoid SSR issues
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
});

const EventAbout = ({ formData, setFormData }) => {
  const [editorContent, setEditorContent] = useState({
    description: formData.description || "",
  });

  // ✅ Handle TinyMCE Editor Change
  const handleEditorChange = (name, content) => {
    setEditorContent((prev) => ({ ...prev, [name]: content }));
    setFormData((prev) => ({ ...prev, [name]: content }));
  };

  // ✅ Sync local state with formData when editing
  useEffect(() => {
    setEditorContent({
      description: formData.description || "",
    });
  }, [formData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Event Description</h2>

      {/* ✅ Description (Rich Text Editor) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Event Description:</label>
        <Editor
          apiKey="your-tinymce-api-key"
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
