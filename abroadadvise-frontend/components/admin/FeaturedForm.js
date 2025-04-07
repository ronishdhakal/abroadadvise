"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  createFeaturedPage,
  updateFeaturedPage,
  getFeaturedBySlug,
} from "@/utils/api";

// ✅ Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FeaturedForm = ({ slug, onSuccess, onCancel }) => {
  const isEditing = !!slug;

  const defaultFormData = useMemo(
    () => ({
      title: "",
      slug: "",
      destination: "",
      sub_title: "", // ✅ New field
      description_top: "",
      description_bottom: "",
      api_route: "",
      priority: "",
      is_active: true,
      meta_title: "",
      meta_description: "",
      meta_author: "",
    }),
    []
  );

  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const editorRefTop = useRef(null);
  const editorRefBottom = useRef(null);
  const editorRefMetaDesc = useRef(null);

  const [editorContent, setEditorContent] = useState({
    description_top: "",
    description_bottom: "",
    meta_description: "",
  });

  const joditConfig = {
    height: 300,
    tabIndex: 1,
    style: {
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      backgroundColor: "#f9fafb",
    },
  };

  useEffect(() => {
    setEditorContent({
      description_top: formData.description_top || "",
      description_bottom: formData.description_bottom || "",
      meta_description: formData.meta_description || "",
    });
  }, [formData]);

  const handleEditorChange = (field, value) => {
    setEditorContent((prev) => ({ ...prev, [field]: value }));
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.title]);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getFeaturedBySlug(slug)
        .then((data) => setFormData(data))
        .catch((err) => {
          console.error("❌ Failed to fetch featured detail:", err);
          setError("Failed to load featured page.");
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isEditing) {
        await updateFeaturedPage(slug, formData);
        setSuccess("✅ Featured page updated successfully!");
      } else {
        await createFeaturedPage(formData);
        setSuccess("✅ Featured page created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err.message || "❌ Failed to save featured page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 border-b border-[#4c9bd5] pb-2 text-gray-800">
        {isEditing ? "Edit Featured Page" : "Create Featured Page"}
      </h2>

      {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
      {success && <p className="text-green-500 mb-4 font-medium">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Destination <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g., Canada, USA"
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* ✅ Sub Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Sub Title</label>
          <input
            type="text"
            name="sub_title"
            value={formData.sub_title}
            onChange={handleChange}
            placeholder="e.g., Explore top consultancies for Canada"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Description Top */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Top Description</label>
          <JoditEditor
            ref={editorRefTop}
            value={editorContent.description_top}
            config={joditConfig}
            onBlur={(content) => handleEditorChange("description_top", content)}
          />
        </div>

        {/* Description Bottom */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Bottom Description</label>
          <JoditEditor
            ref={editorRefBottom}
            value={editorContent.description_bottom}
            config={joditConfig}
            onBlur={(content) => handleEditorChange("description_bottom", content)}
          />
        </div>

        {/* API Route */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            API Route <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="api_route"
            value={formData.api_route}
            onChange={handleChange}
            placeholder="/consultancy/?destination=canada"
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Priority + Status */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">Priority</label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-3 sm:mt-8">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-5 w-5 text-[#4c9bd5]"
            />
            <label className="text-gray-700 font-semibold">Active</label>
          </div>
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Meta Title</label>
          <input
            type="text"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Meta Description</label>
          <JoditEditor
            ref={editorRefMetaDesc}
            value={editorContent.meta_description}
            config={joditConfig}
            onBlur={(content) => handleEditorChange("meta_description", content)}
          />
        </div>

        {/* Meta Author */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Meta Author</label>
          <input
            type="text"
            name="meta_author"
            value={formData.meta_author}
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#4c9bd5] text-white px-6 py-3 rounded-lg shadow hover:bg-[#3a8bc5] transition"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-600 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeaturedForm;
