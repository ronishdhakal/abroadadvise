"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import NewsForm from "@/components/admin/NewsForm";
import { getNewsList, deleteNews, getNewsBySlug } from "@/utils/api";
import Pagination from "@/pages/news/NewsPagination"; // ✅ Shared reusable component

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Load news dynamically
  const loadNews = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await getNewsList({ page, search });
      setNews(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // Based on page size from backend
    } catch (err) {
      console.error("❌ Failed to load news:", err);
      setError("Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [page, search]);

  // ✅ Handle Delete
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this news post?")) return;

    const originalNews = [...news];
    setNews((prev) => prev.filter((n) => n.slug !== slug));

    try {
      await deleteNews(slug);
      setSuccessMessage("✅ News deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete news:", err);
      setError("Failed to delete news.");
      setNews(originalNews);
    }
  };

  // ✅ Handle Edit
  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const newsData = await getNewsBySlug(slug);
      setEditingData(newsData);
    } catch (err) {
      console.error("❌ Failed to load news details for editing:", err);
      setError("Failed to load news details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ On Success (Save)
  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ News saved successfully!");
    loadNews();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage News Articles</h1>

      {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

      {/* ✅ Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
          className="border rounded-lg p-2 w-full"
        />
        <button
          onClick={loadNews}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* ✅ Toggle Form */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingSlug(null);
          setEditingData(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Cancel" : "Add New News"}
      </button>

      {/* ✅ News Form */}
      {showForm && (
        <NewsForm
          newsSlug={editingSlug}
          newsData={editingData}
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
        <p>Loading news...</p>
      ) : news.length === 0 ? (
        <p className="text-gray-500">No news available.</p>
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
              {news.map((article, index) => (
                <tr key={article.id}>
                  <td className="border p-2">{index + 1 + (page - 1) * 10}</td>
                  <td className="border p-2">{article.title}</td>
                  <td className="border p-2">{article.author_name}</td>
                  <td className="border p-2">{article.category?.name || "Uncategorized"}</td>
                  <td className="border p-2">{article.is_published ? "Yes" : "No"}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(article.slug)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.slug)}
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
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default NewsPage;
