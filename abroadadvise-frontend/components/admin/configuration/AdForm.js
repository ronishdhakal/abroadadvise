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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {editMode ? "Edit Advertisement" : "New Advertisement"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4c9bd5] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Placement</label>
          <select
            name="placement"
            value={formData.placement}
            onChange={handleChange}
            required
            disabled={editMode}
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4c9bd5] transition-colors disabled:bg-gray-100"
          >
            <option value="">Select Placement</option>
            {PLACEMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Redirect URL</label>
          <input
            type="url"
            name="redirect_url"
            value={formData.redirect_url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4c9bd5] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Desktop Image</label>
          <input
            type="file"
            name="desktop_image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Mobile Image</label>
          <input
            type="file"
            name="mobile_image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-gray-700"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-[#4c9bd5] border-gray-200 rounded focus:ring-[#4c9bd5]"
          />
          <label className="ml-2 text-sm text-gray-700">Active</label>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
        >
          {editMode ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdForm;