"use client";

import { useState, useEffect } from "react";
import {
  createNews,
  updateNews,
  getNewsBySlug,
  fetchNewsCategories, // ✅ FIXED name here
} from "@/utils/api";
import NewsHeader from "./news/NewsHeader";
import NewsBody from "./news/NewsBody";

const NewsForm = ({ newsSlug, onSuccess, onCancel }) => {
  const isEditing = !!newsSlug;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "", // always string for select input
    detail: "",
    priority: 0,
    is_published: false,
    featured_image: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchNewsCategories();
        setCategories(data.results || []);
      } catch (err) {
        console.error("❌ Failed to fetch news categories:", err);
        setError("Failed to load categories.");
      }
    };
    loadCategories();
  }, []);

  // ✅ Load news if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getNewsBySlug(newsSlug)
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            ...data,
            category: data.category?.id ? String(data.category.id) : "",
            featured_image: data.featured_image || null,
          }));
        })
        .catch(() => setError("❌ Failed to load news details"))
        .finally(() => setLoading(false));
    }
  }, [newsSlug, isEditing]);

  // ✅ Auto-generate slug
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
  }, [formData.title, formData.slug]);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
        if (key === "category") {
          submissionData.append("category_id", value); // ✅ FIXED here
        } else if (key !== "featured_image" && value !== null && value !== undefined) {
          submissionData.append(key, value);
        }
      });
      

    if (formData.featured_image instanceof File) {
      submissionData.append("featured_image", formData.featured_image);
    }

    try {
      if (isEditing) {
        await updateNews(newsSlug, submissionData);
        setSuccess("✅ News updated successfully!");
      } else {
        await createNews(submissionData);
        setSuccess("✅ News created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err.message || "❌ Failed to save news.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete image
  const handleImageDelete = () => {
    setFormData((prev) => ({ ...prev, featured_image: null }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit News" : "Create News"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <NewsHeader
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onDeleteImage={handleImageDelete}
        />

        <NewsBody formData={formData} setFormData={setFormData} />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
