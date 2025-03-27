"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import NewsForm from "@/components/admin/NewsForm";
import Pagination from "@/pages/consultancy/Pagination";
import {
  getNewsList,
  deleteNews,
  getNewsBySlug,
} from "@/utils/api";
import NewsCategoryManager from "@/components/admin/news/CategoryManager";

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
      <Head>
        <title>Manage News Articles | Admin Panel</title>
        <meta
          name="description"
          content="Manage news articles in Abroad Advise admin panel. Add, edit, delete news articles, and manage categories seamlessly."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage News Articles</h1>

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
              placeholder="Search news..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
            />
            <button
              onClick={loadNews}
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
            {showForm ? "Cancel" : "Add New News"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
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
          </div>
        )}

        {loading ? (
          <div className="text-center py-6 text-gray-600">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-6 text-gray-600">No news available.</div>
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
                  {news.map((article, index) => (
                    <tr
                      key={article.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <td className="p-4 text-gray-600">{index + 1 + (page - 1) * 10}</td>
                      <td className="p-4 text-gray-800">{article.title}</td>
                      <td className="p-4 text-gray-600">{article.author_name}</td>
                      <td className="p-4 text-gray-600">{article.category?.name || "Uncategorized"}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.is_published
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {article.is_published ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                          onClick={() => handleEdit(article.slug)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                          onClick={() => handleDelete(article.slug)}
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
          <NewsCategoryManager />
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsPage;