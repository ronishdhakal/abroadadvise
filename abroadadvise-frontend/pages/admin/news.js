"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import NewsForm from "@/components/admin/NewsForm";
import Pagination from "@/pages/news/NewsPagination";

import {
  getNewsList,
  deleteNews,
  getNewsBySlug,
  fetchNewsCategories,
  createNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
} from "@/utils/api";

import NewsCategoryManager from "@/components/admin/news/CategoryManager"; // ✅ Use your modular component

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

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNewsList({ page, search });
      setNews(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10));
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

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;
    const originalNews = [...news];
    setNews((prev) => prev.filter((n) => n.slug !== slug));
    try {
      await deleteNews(slug);
      setSuccessMessage("✅ News deleted successfully!");
    } catch (err) {
      setError("Failed to delete news.");
      setNews(originalNews);
    }
  };

  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);
    try {
      const newsData = await getNewsBySlug(slug);
      setEditingData(newsData);
    } catch (err) {
      setError("Failed to load news details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ News saved successfully!");
    loadNews();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage News Articles</h1>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
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

      {/* ✅ Toggle News Form */}
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
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(article.slug)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(article.slug)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

      {/* ✅ News Category Management */}
      <hr className="my-8" />
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
      <NewsCategoryManager />
    </AdminLayout>
  );
};

export default NewsPage;
