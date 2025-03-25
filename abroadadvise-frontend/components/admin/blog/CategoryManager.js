"use client";

import { useEffect, useState } from "react";
import {
  fetchBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "@/utils/api";
import CategoryForm from "./CategoryForm";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : ""; // updated code

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchBlogCategories();
      console.log("📦 API Response for Categories:", data); // Debug log
      const resultArray = data.results || []; // ✅ THIS is the key fix
      setCategories(resultArray); // ✅ Always set array here
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteBlogCategory(slug, token);
      setSuccessMessage("✅ Category deleted");
      loadCategories();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      setError("❌ Failed to delete category.");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    loadCategories();
    setSuccessMessage("✅ Category saved");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setShowForm(!showForm);
          setEditingCategory(null);
        }}
      >
        {showForm ? "Cancel" : "Add New Category"}
      </button>

      {showForm && (
        <CategoryForm
          initialData={editingCategory}
          onSuccess={handleFormSuccess}
          token={token}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Slug</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{cat.name}</td>
                <td className="border p-2">{cat.slug}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(cat.slug)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryManager;
