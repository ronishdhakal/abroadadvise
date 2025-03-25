"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogForm from "@/components/admin/BlogForm";
import Pagination from "@/pages/blog/BlogPagination"; // ✅ Add reusable pagination
import { getBlogs, deleteBlog, getBlogBySlug } from "@/utils/api";
import CategoryManager from "@/components/admin/blog/CategoryManager"; // ✅ Import category manager

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBlogs({ page, search });
      setBlogs(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10)); // ✅ Calculate total pages
    } catch (err) {
      console.error("❌ Failed to load blogs:", err);
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [page, search]);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    const originalBlogs = [...blogs];
    setBlogs((prev) => prev.filter((b) => b.slug !== slug));
    try {
      await deleteBlog(slug);
      setSuccessMessage("✅ Blog deleted successfully!");
    } catch (err) {
      setError("Failed to delete blog.");
      setBlogs(originalBlogs); // Revert
    }
  };

  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);
    try {
      const blogData = await getBlogBySlug(slug);
      setEditingData(blogData);
    } catch (err) {
      setError("Failed to load blog details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Blog saved successfully!");
    loadBlogs();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Blog Posts</h1>

      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* ✅ Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset page on search
          }}
          className="border rounded-lg p-2 w-full"
        />
        <button
          onClick={loadBlogs}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* ✅ Toggle Blog Form */}
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

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <>
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
                  <td className="border p-2">{index + 1 + (page - 1) * 10}</td>
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

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* ✅ Category Management Section Below Blog List */}
      <hr className="my-8" />
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
      <CategoryManager />
    </AdminLayout>
  );
};

export default BlogsPage;
