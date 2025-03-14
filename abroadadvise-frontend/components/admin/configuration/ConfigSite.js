"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, updateSiteSettings } from "@/utils/api";

const ConfigSite = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    site_logo: null,
    hero_image: null,
  });

  // ✅ Fetch Site Settings
  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    setLoading(true);
    try {
      const response = await getSiteSettings();
      setSiteSettings(response.data);
    } catch (err) {
      console.error("❌ Failed to load site settings:", err);
      setError("Failed to load site settings.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle File Change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  // ✅ Handle Form Submit (Update Site Settings)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await updateSiteSettings(formDataToSend);
      loadSiteSettings(); // Refresh data
    } catch (err) {
      console.error("❌ Failed to update site settings:", err);
      setError("Failed to update site settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Site Settings</h2>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading site settings...</p>
      ) : (
        <div className="border p-4 rounded shadow-md">
          {/* ✅ Display Current Site Settings */}
          {siteSettings && (
            <div className="mb-4">
              {siteSettings.site_logo_url && (
                <img src={siteSettings.site_logo_url} alt="Site Logo" className="w-32 rounded" />
              )}
              {siteSettings.hero_image_url && (
                <img src={siteSettings.hero_image_url} alt="Hero Image" className="w-32 rounded mt-2" />
              )}
            </div>
          )}

          {/* ✅ Update Site Settings Form */}
          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block font-medium mb-1">Upload New Site Logo:</label>
            <input type="file" name="site_logo" onChange={handleFileChange} className="border p-2 rounded w-full mb-4" />

            <label className="block font-medium mb-1">Upload New Hero Image:</label>
            <input type="file" name="hero_image" onChange={handleFileChange} className="border p-2 rounded w-full mb-4" />

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Update Site Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ConfigSite;
