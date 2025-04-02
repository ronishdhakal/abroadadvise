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

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchBlogCategories();
      console.log("📦 API Response for Categories:", data);
      const resultArray = data.results || [];
      setCategories(resultArray);
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
      {/* Success/Error Messages */}
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

      {/* Add New Category Button */}
      <div className="flex justify-end mb-6">
        <button
          className={`px-4 py-3 rounded-lg font-medium transition-all ${
            showForm
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "bg-[#4c9bd5] text-white hover:bg-[#3a8cc4]"
          }`}
          onClick={() => {
            setShowForm(!showForm);
            setEditingCategory(null);
          }}
        >
          {showForm ? "Cancel" : "Add New Category"}
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <CategoryForm
            initialData={editingCategory}
            onSuccess={handleFormSuccess}
            token={token}
          />
        </div>
      )}

      {/* Categories Table */}
      {loading ? (
        <div className="text-center py-6 text-gray-600">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-6 text-gray-600">No categories available.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-4 text-left font-semibold min-w-[50px]">#</th>
                <th className="p-4 text-left font-semibold min-w-[200px]">Name</th>
                <th className="p-4 text-left font-semibold min-w-[150px]">Slug</th>
                <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr
                  key={cat.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <td className="p-4 text-gray-600">{index + 1}</td>
                  <td className="p-4 text-gray-800">{cat.name}</td>
                  <td className="p-4 text-gray-600">{cat.slug}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                      onClick={() => handleDelete(cat.slug)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;