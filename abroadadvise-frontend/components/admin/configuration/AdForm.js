"use client";

import { useState } from "react";

const PLACEMENT_OPTIONS = [
  { value: "roadblock_ad", label: "Roadblock Ad All Pages" },
  { value: "exclusive_below_navbar", label: "Exclusive Ad Below Navbar" },
  { value: "exclusive_above_footer", label: "Exclusive Ad Above Footer" },
  { value: "below_navbar_blog_news", label: "Below Navbar Blog and News" },
  { value: "above_headline_blog_news", label: "Above Headline Blog and News" },
  { value: "below_headline_blog_news", label: "Below Headline Blog and News" },
  { value: "below_featured_image_blog_news", label: "Below Featured Image Blog and News" },
  { value: "above_footer_blog_news", label: "Above Footer Blog and News" },
];

const AdForm = ({ initialData, editMode, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    placement: initialData?.placement || "",
    redirect_url: initialData?.redirect_url || "",
    is_active: initialData?.is_active ?? true,
    desktop_image: null,
    mobile_image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert formData to FormData object for file uploads
    const submission = new FormData();
    submission.append("title", formData.title);
    submission.append("placement", formData.placement);
    submission.append("redirect_url", formData.redirect_url);
    submission.append("is_active", formData.is_active);

    if (formData.desktop_image) {
      submission.append("desktop_image", formData.desktop_image);
    }
    if (formData.mobile_image) {
      submission.append("mobile_image", formData.mobile_image);
    }

    onSubmit(submission);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-md bg-gray-50 mb-6">
      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Placement</label>
        <select
          name="placement"
          value={formData.placement}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
          disabled={editMode} // Prevent placement change while editing
        >
          <option value="">Select Placement</option>
          {PLACEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Redirect URL</label>
        <input
          type="url"
          name="redirect_url"
          value={formData.redirect_url}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Desktop Image</label>
        <input
          type="file"
          name="desktop_image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mobile Image</label>
        <input
          type="file"
          name="mobile_image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="font-medium">Is Active</label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editMode ? "Update Ad" : "Create Ad"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdForm;
