import { useState } from "react";
import {
  createBlogCategory,
  updateBlogCategory,
} from "@/utils/api";

const CategoryForm = ({ initialData, onSuccess, token }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isEditing) {
        await updateBlogCategory(initialData.slug, { name }, token);
      } else {
        await createBlogCategory({ name }, token);
      }
      onSuccess();
    } catch (err) {
      console.error("❌ Error saving blog category:", err);
      setError("❌ Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-4 border p-4 rounded bg-white shadow-md">
      <label className="block mb-2 font-medium text-gray-700">Category Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5]"
        required
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#4c9bd5] hover:bg-[#3a8cc4]"
        }`}
      >
        {isEditing ? "Update" : "Create"}
      </button>
    </div>
  );
};

export default CategoryForm;