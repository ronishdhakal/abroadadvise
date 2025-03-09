import { useState, useEffect } from "react";
import Select from "react-select";

const NewsFilter = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/categories/`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
          setCategories(data.results);
        } else {
          setError("Invalid categories data format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    })),
  ];

  return (
    <div className="mt-4 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black">Filter by Category</h2>
        <button
          onClick={() => setCategory("")}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Category Dropdown */}
      {loading ? (
        <p className="text-gray-500 text-sm mt-2">Loading categories...</p>
      ) : (
        <Select
          options={categoryOptions}
          value={categoryOptions.find((opt) => opt.value === category)}
          onChange={(selected) => setCategory(selected ? selected.value : "")}
          placeholder="Select Category"
          classNamePrefix="react-select"
          className="mt-2"
        />
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default NewsFilter;