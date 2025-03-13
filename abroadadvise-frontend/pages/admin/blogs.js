"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogs, deleteBlog, getBlogBySlug } from "@/utils/api";

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editingSlug, setEditingSlug] = useState(null);
    const [editingData, setEditingData] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // ✅ Fetch Blogs on Client Side
    useEffect(() => {
        const loadBlogs = async () => {
            setLoading(true);
            setError(null);
            setSuccessMessage("");

            try {
                const data = await getBlogs({ page, search });
                console.log("✅ Fetched Blogs Data:", data.results);
                setBlogs(data.results);
            } catch (err) {
                console.error("❌ Failed to load blogs:", err);
                setError("Failed to load blogs.");
            } finally {
                setLoading(false);
            }
        };

        loadBlogs();
    }, [page, search]);

    // ✅ Handle Delete Blog
    const handleDelete = async (slug) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;

        // ✅ Optimistic UI Update (Remove instantly)
        const originalBlogs = [...blogs];
        setBlogs((prev) => prev.filter((b) => b.slug !== slug));

        try {
            await deleteBlog(slug);
            setSuccessMessage("✅ Blog deleted successfully!");
        } catch (err) {
            console.error("❌ Failed to delete blog:", err);
            setError("Failed to delete blog.");
            setBlogs(originalBlogs); // ✅ Revert if deletion fails
        }
    };

    // ✅ Handle Edit Blog
    const handleEdit = async (slug) => {
        setLoading(true);
        setEditingSlug(slug);
        setShowForm(true);

        try {
            const blogData = await getBlogBySlug(slug);
            setEditingData(blogData);
        } catch (err) {
            console.error("❌ Failed to load blog details for editing:", err);
            setError("Failed to load blog details.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Successful Create/Update
    const handleSuccess = () => {
        setShowForm(false);
        setEditingSlug(null);
        setEditingData(null);
        setSuccessMessage("✅ Blog saved successfully!");
        setLoading(true);
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Manage Blog Posts</h1>

            {/* ✅ Success Message */}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* ✅ Toggle Form */}
            <button
                onClick={() => {
                    setShowForm(!showForm);
                    setEditingSlug(null);
                    setEditingData(null);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                {showForm ? "Cancel" : "Add New Blog"}
            </button>

            {/* ✅ Blog Form */}
            {showForm && (
                <BlogForm
                    blogSlug={editingSlug}
                    blogData={editingData}
                    onSuccess={handleSuccess}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingSlug(null);
                        setEditingData(null);
                    }}
                />
            )}

            {/* ✅ Error Handling */}
            {error && <p className="text-red-500">{error}</p>}

            {/* ✅ Blog List */}
            {loading ? (
                <p>Loading blogs...</p>
            ) : blogs.length === 0 ? (
                <p className="text-gray-500">No blogs available.</p>
            ) : (
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">#</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Author</th>
                            <th className="border p-2">Category</th>
                            <th className="border p-2">Published</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog, index) => (
                            <tr key={blog.id}>
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{blog.title}</td>
                                <td className="border p-2">{blog.author_name}</td>
                                <td className="border p-2">{blog.category?.name || "Uncategorized"}</td>
                                <td className="border p-2">{blog.is_published ? "Yes" : "No"}</td>
                                <td className="border p-2 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(blog.slug)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.slug)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </AdminLayout>
    );
};

export default BlogsPage;
