"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogForm from "@/components/admin/BlogForm";
import Pagination from "@/pages/consultancy/Pagination";
import { getBlogs, deleteBlog, getBlogBySlug } from "@/utils/api";
import CategoryManager from "@/components/admin/blog/CategoryManager";

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
      setTotalPages(Math.ceil((data.count || 0) / 10));
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
      setBlogs(originalBlogs);
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
      <Head>
        <title>Manage Blog Posts | Admin Panel</title>
        <meta
          name="description"
          content="Manage blog posts in Abroad Advise admin panel. Add, edit, delete blog posts, and manage categories seamlessly."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Blog Posts</h1>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
            />
            <button
              onClick={loadBlogs}
              className="bg-[#4c9bd5] text-white px-4 py-3 rounded-lg hover:bg-[#3a8cc4] transition-all"
            >
              Search
            </button>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingSlug(null);
              setEditingData(null);
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              showForm
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-[#4c9bd5] text-white hover:bg-[#3a8cc4]"
            }`}
          >
            {showForm ? "Cancel" : "Add New Blog"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
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
          </div>
        )}

        {loading ? (
          <div className="text-center py-6 text-gray-600">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-6 text-gray-600">No blogs available.</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold min-w-[50px]">#</th>
                    <th className="p-4 text-left font-semibold min-w-[200px]">Title</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Author</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Category</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Published</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, index) => (
                    <tr
                      key={blog.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <td className="p-4 text-gray-600">{index + 1 + (page - 1) * 10}</td>
                      <td className="p-4 text-gray-800">{blog.title}</td>
                      <td className="p-4 text-gray-600">{blog.author_name}</td>
                      <td className="p-4 text-gray-600">{blog.category?.name || "Uncategorized"}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            blog.is_published
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {blog.is_published ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(blog.slug)}
                          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.slug)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        <hr className="my-8 border-gray-200" />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Categories</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <CategoryManager />
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogsPage;