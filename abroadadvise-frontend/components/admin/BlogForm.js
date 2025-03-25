"use client";

import { useState, useEffect } from "react";
import {
  createBlog,
  updateBlog,
  getBlogBySlug,
  fetchBlogCategories,
} from "@/utils/api";
import BlogHeader from "./blog/BlogHeader";
import BlogBody from "./blog/BlogBody";

const BlogForm = ({ blogSlug, onSuccess, onCancel }) => {
  const isEditing = !!blogSlug;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: null,
    content: "",
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
        const data = await fetchBlogCategories();
        setCategories(data.results || []); // ✅ KEY FIX
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
        setError("Failed to load categories.");
      }
    };
    loadCategories();
  }, []);

  // ✅ Load blog if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getBlogBySlug(blogSlug)
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            ...data,
            category: data.category?.id || null,
            featured_image: data.featured_image || null,
          }));
        })
        .catch((err) => {
          console.error("❌ Failed to load blog details:", err);
          setError("Failed to load blog details.");
        })
        .finally(() => setLoading(false));
    }
  }, [blogSlug, isEditing]);

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
      if (key !== "featured_image" && value !== null && value !== undefined) {
        submissionData.append(key, value);
      }
    });

    if (formData.featured_image instanceof File) {
      submissionData.append("featured_image", formData.featured_image);
    }

    try {
      if (isEditing) {
        await updateBlog(blogSlug, submissionData);
        setSuccess("✅ Blog updated successfully!");
      } else {
        await createBlog(submissionData);
        setSuccess("✅ Blog created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err.message || "❌ Failed to save blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = () => {
    setFormData((prev) => ({
      ...prev,
      featured_image: null,
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Blog" : "Create Blog"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <BlogHeader
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onDeleteImage={handleImageDelete}
        />

        <BlogBody formData={formData} setFormData={setFormData} />

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

export default BlogForm;
