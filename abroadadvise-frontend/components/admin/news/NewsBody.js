"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const NewsBody = ({ formData, setFormData }) => {
    // ✅ Local states for controlled inputs
    const [content, setContent] = useState("");
    const [priority, setPriority] = useState("");
    const [isPublished, setIsPublished] = useState(true);

    // ✅ Sync state when editing an existing news article
    useEffect(() => {
        setContent(formData.detail || ""); // ✅ Using `detail` for news content
        setPriority(formData.priority || "");
        setIsPublished(formData.is_published ?? true);
    }, [formData.detail, formData.priority, formData.is_published]);

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">News Content & Settings</h2>

            {/* ✅ Priority Field */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                    Priority (Lower number = Higher Rank)
                </label>
                <input
                    type="number"
                    value={priority}
                    onChange={(e) => {
                        setPriority(e.target.value);
                        setFormData((prev) => ({ ...prev, priority: e.target.value }));
                    }}
                    className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
                    placeholder="Enter priority (e.g., 1, 2, 3)"
                />
            </div>

            {/* ✅ News Content Editor */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">News Content</label>
                <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    value={content}
                    onEditorChange={(content) => {
                        setContent(content);
                        setFormData((prev) => ({ ...prev, detail: content })); // ✅ Using `detail` for news
                    }}
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: "advlist autolink lists link image charmap preview anchor table",
                        toolbar:
                            "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | link image | preview",
                    }}
                />
            </div>

            {/* ✅ Publish Toggle */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Publish News</label>
                <select
                    value={isPublished ? "true" : "false"}
                    onChange={(e) => {
                        const value = e.target.value === "true";
                        setIsPublished(value);
                        setFormData((prev) => ({ ...prev, is_published: value }));
                    }}
                    className="border rounded-lg w-full p-3 focus:ring focus:ring-blue-300"
                >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                </select>
            </div>
        </div>
    );
};

export default NewsBody;
