import { useState, useEffect } from "react";

const DestinationHeader = ({ formData, onChange, onFileChange }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // ✅ Update previews when formData changes (for image URL or file selection)
  useEffect(() => {
    if (formData.country_logo && typeof formData.country_logo === "string") {
      setLogoPreview(formData.country_logo); // Existing image URL
    }
    if (formData.cover_page && typeof formData.cover_page === "string") {
      setCoverPreview(formData.cover_page); // Existing image URL
    }
  }, [formData.country_logo, formData.cover_page]);

  // ✅ Cleanup old previews to prevent memory leaks
  useEffect(() => {
    return () => {
      if (logoPreview && typeof logoPreview !== "string") URL.revokeObjectURL(logoPreview);
      if (coverPreview && typeof coverPreview !== "string") URL.revokeObjectURL(coverPreview);
    };
  }, [logoPreview, coverPreview]);

  // ✅ Handle file selection and update preview
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];

      // ✅ Generate preview & cleanup old previews
      if (name === "country_logo") {
        if (logoPreview && typeof logoPreview !== "string") URL.revokeObjectURL(logoPreview);
        setLogoPreview(URL.createObjectURL(file)); // Set the preview for country logo
      }
      if (name === "cover_page") {
        if (coverPreview && typeof coverPreview !== "string") URL.revokeObjectURL(coverPreview);
        setCoverPreview(URL.createObjectURL(file)); // Set the preview for cover page
      }

      // ✅ Update formData with the selected file
      onFileChange(e);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Destination Header</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
          required
        />
      </div>

      {/* Slug */}
      <div className="mb-4">
        <label className="block text-gray-700">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug || ""}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      {/* Country Logo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700">Country Logo</label>
        <input
          type="file"
          name="country_logo"
          onChange={handleFileChange}
          className="border rounded-lg p-2 w-full"
        />
        {logoPreview && (
          <img src={logoPreview} alt="Logo Preview" className="mt-2 w-20 h-20 object-cover" />
        )}
      </div>

      {/* Cover Photo Upload */}
      <div className="mb-4">
        <label className="block text-gray-700">Cover Photo</label>
        <input
          type="file"
          name="cover_page"
          onChange={handleFileChange}
          className="border rounded-lg p-2 w-full"
        />
        {coverPreview && (
          <img src={coverPreview} alt="Cover Preview" className="mt-2 w-full h-40 object-cover" />
        )}
      </div>
    </div>
  );
};

export default DestinationHeader;
