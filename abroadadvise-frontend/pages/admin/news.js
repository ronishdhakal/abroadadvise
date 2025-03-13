"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import NewsForm from "@/components/admin/NewsForm"; // ✅ Create this separately
import { getNewsList, deleteNews, getNewsBySlug } from "@/utils/api";

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editingSlug, setEditingSlug] = useState(null);
    const [editingData, setEditingData] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // ✅ Fetch News List on Client Side
    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            setError(null);
            setSuccessMessage("");

            try {
                const data = await getNewsList({ page, search });
                console.log("✅ Fetched News Data:", data.results);
                setNews(data.results);
            } catch (err) {
                console.error("❌ Failed to load news:", err);
                setError("Failed to load news.");
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [page, search]);

    // ✅ Handle Delete News
    const handleDelete = async (slug) => {
        if (!window.confirm("Are you sure you want to delete this news post?")) return;

        // ✅ Optimistic UI Update (Remove instantly)
        const originalNews = [...news];
        setNews((prev) => prev.filter((n) => n.slug !== slug));

        try {
            await deleteNews(slug);
            setSuccessMessage("✅ News deleted successfully!");
        } catch (err) {
            console.error("❌ Failed to delete news:", err);
            setError("Failed to delete news.");
            setNews(originalNews); // ✅ Revert if deletion fails
        }
    };

    // ✅ Handle Edit News
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

    // ✅ Handle Successful Create/Update
    const handleSuccess = () => {
        setShowForm(false);
        setEditingSlug(null);
        setEditingData(null);
        setSuccessMessage("✅ News saved successfully!");
        setLoading(true);
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Manage News Articles</h1>

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

            {/* ✅ Error Handling */}
            {error && <p className="text-red-500">{error}</p>}

            {/* ✅ News List */}
            {loading ? (
                <p>Loading news...</p>
            ) : news.length === 0 ? (
                <p className="text-gray-500">No news available.</p>
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
                        {news.map((article, index) => (
                            <tr key={article.id}>
                                <td className="border p-2">{index + 1}</td>
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
            )}
        </AdminLayout>
    );
};

export default NewsPage;
