import { useState } from "react";
import {
  createNewsCategory,
  updateNewsCategory,
} from "@/utils/api"; // ✅ Use news category APIs

const NewsCategoryForm = ({ initialData, onSuccess, token }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [error, setError] = useState("");

  const isEditing = Boolean(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isEditing) {
        await updateNewsCategory(initialData.slug, { name }, token);
      } else {
        await createNewsCategory({ name }, token);
      }
      onSuccess();
    } catch (err) {
      console.error("❌ Error saving news category:", err);
      setError("❌ Failed to save category.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 border p-4 rounded">
      <label className="block mb-2 font-medium">Category Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {isEditing ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default NewsCategoryForm;
