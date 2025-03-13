"use client";

import { useState, useEffect } from "react";
import { createBlog, updateBlog, getBlogBySlug, getBlogCategories } from "@/utils/api";
import BlogHeader from "./blog/BlogHeader";
import BlogBody from "./blog/BlogBody";

const BlogForm = ({ blogSlug, onSuccess, onCancel }) => {
    const isEditing = !!blogSlug;

    // ✅ State for Form Data & Categories
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        content: "",
        priority: "",
        is_published: true,
        featured_image: null,
    });

    const [categories, setCategories] = useState([]); // ✅ Store categories
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ✅ Fetch Categories on Component Mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getBlogCategories();
                setCategories(data);
            } catch (err) {
                console.error("❌ Failed to fetch categories:", err);
            }
        };
        loadCategories();
    }, []);

    // ✅ Load blog data if editing
    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            getBlogBySlug(blogSlug)
                .then((data) => {
                    console.log("✅ Fetched Blog Data:", data);
                    setFormData((prev) => ({
                        ...prev,
                        ...data,
                        category: data.category?.id || "",
                        featured_image: data.featured_image || prev.featured_image,
                    }));
                })
                .catch(() => setError("❌ Failed to load blog details"))
                .finally(() => setLoading(false));
        }
    }, [blogSlug]);

    // ✅ Handle Slug (Auto-generate but allow manual edit)
    useEffect(() => {
        if (formData.title && !formData.slug) {
            setFormData((prev) => ({
                ...prev,
                slug: prev.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
            }));
        }
    }, [formData.title]);

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const submissionData = new FormData();

        // ✅ Append all non-file fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "featured_image" && value !== null && value !== undefined) {
                submissionData.append(key, value);
            }
        });

        // ✅ Append featured image only if it's a new file
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

    // ✅ Handle Image Deletion
    const handleImageDelete = () => {
        setFormData((prev) => ({
            ...prev,
            featured_image: null, // ✅ Remove image from state
        }));
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Blog" : "Create Blog"}</h2>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* ✅ Blog Header (Pass categories & handle image delete) */}
                <BlogHeader
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    onDeleteImage={handleImageDelete}
                />

                {/* ✅ Blog Body (Content & Publish Settings) */}
                <BlogBody formData={formData} setFormData={setFormData} />

                {/* ✅ Submit & Cancel Buttons */}
                <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
                    >
                        {loading ? "Saving..." : isEditing ? "Update" : "Create"}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
