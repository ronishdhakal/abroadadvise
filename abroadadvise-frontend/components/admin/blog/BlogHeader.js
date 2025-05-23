import { useState, useEffect } from "react";

const BlogHeader = ({ formData, setFormData, categories = [], onDeleteImage }) => {
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ Set initial preview image if editing
  useEffect(() => {
    if (formData?.featured_image) {
      if (typeof formData.featured_image === "string") {
        setPreviewImage(formData.featured_image);
      } else {
        setPreviewImage(URL.createObjectURL(formData.featured_image));
      }
    }
  }, [formData?.featured_image]);

  // ✅ Handle Change for Text Inputs (Title, Slug, Category)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Featured Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, featured_image: file }));
    }
  };

  // ✅ Handle Image Delete
  const handleDeleteImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, featured_image: null }));
    if (onDeleteImage) {
      onDeleteImage();
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-lg font-bold mb-2">Blog Details</h2>

      {/* ✅ Title */}
      <label className="block mb-2">Title</label>
      <input
        type="text"
        name="title"
        value={formData?.title || ""} // ✅ Optional chaining and default value
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
        placeholder="Enter blog title"
        required
      />

      {/* ✅ Slug */}
      <label className="block mb-2">Slug</label>
      <input
        type="text"
        name="slug"
        value={formData?.slug || ""} // ✅ Optional chaining and default value
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
        placeholder="Enter URL slug"
        required
      />

      {/* ✅ Category Selection (Handle Undefined Categories) */}
      <label className="block mb-2">Category</label>
      <select
        name="category"
        value={formData?.category || null} // ✅ Optional chaining and default value
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
      >
        <option value="">Select Category</option>
        {categories?.length > 0 ? ( // ✅ Optional chaining
          categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        ) : (
          <option disabled>No categories available</option>
        )}
      </select>

      {/* ✅ Featured Image Upload */}
      <label className="block mb-2">Featured Image</label>
      <div className="flex items-center gap-2">
        {previewImage && (
          <div className="relative">
            <img
              src={previewImage}
              alt="Featured Preview"
              className="w-32 h-32 object-cover mb-2 rounded border"
            />
            <button
              onClick={handleDeleteImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              X
            </button>
          </div>
        )}
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default BlogHeader;
