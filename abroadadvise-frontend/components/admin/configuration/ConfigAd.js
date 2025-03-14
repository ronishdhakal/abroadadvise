"use client";

import { useEffect, useState } from "react";
import {
  getAds,
  createAd,
  updateAd,
  deleteAd,
} from "@/utils/api";

const ConfigAd = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    placement: "",
    desktop_image: null,
    mobile_image: null,
    redirect_url: "",
    is_active: true,
  });

  // ✅ Fetch Ads
  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    setLoading(true);
    try {
      const response = await getAds();
      console.log("✅ API Response:", response.data); // Debugging Line
      setAds(response.data.results || response.data || []); // Ensure ads is always an array
    } catch (err) {
      console.error("❌ Failed to load ads:", err);
      setAds([]); // Prevent .map() error
      setError("Failed to load advertisements.");
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle File Upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  // ✅ Handle Create / Update Ad
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      console.log("🔍 Sending Ad Data:", formDataToSend);
  
      if (editMode) {
        await updateAd(selectedAd.id, formDataToSend);
      } else {
        await createAd(formDataToSend);
      }
  
      setShowForm(false);
      loadAds();
    } catch (err) {
      console.error("❌ Failed to save ad:", err.response ? err.response.data : err);
      setError(err.response ? JSON.stringify(err.response.data) : "Failed to save advertisement.");
    } finally {
      setLoading(false);
    }
  };
  
  
  // ✅ Handle Edit Ad
  const handleEdit = (ad) => {
    setSelectedAd(ad);
    setFormData({
      title: ad.title,
      placement: ad.placement,
      desktop_image: null,
      mobile_image: null,
      redirect_url: ad.redirect_url,
      is_active: ad.is_active,
    });
    setEditMode(true);
    setShowForm(true);
  };

  // ✅ Handle Delete Ad
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    setLoading(true);
    try {
      await deleteAd(id);
      loadAds();
    } catch (err) {
      console.error("❌ Failed to delete ad:", err);
      setError("Failed to delete advertisement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Advertisements</h2>

      <button
        onClick={() => {
          setShowForm(true);
          setEditMode(false);
          setFormData({
            title: "",
            placement: "",
            desktop_image: null,
            mobile_image: null,
            redirect_url: "",
            is_active: true,
          });
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add New Ad
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Ad Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 rounded mb-4">
          <h3 className="text-lg font-semibold mb-2">{editMode ? "Edit Ad" : "Create Ad"}</h3>

          <input
            type="text"
            name="title"
            placeholder="Ad Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="border p-2 rounded w-full mb-2"
          />

          <select
            name="placement"
            value={formData.placement}
            onChange={handleInputChange}
            required
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">Select Placement</option>
            <option value="roadblock_ad">Roadblock Ad (All Pages)</option>
            <option value="exclusive_below_navbar">Exclusive Ad Below Navbar</option>
            <option value="exclusive_above_footer">Exclusive Ad Above Footer</option>
            <option value="below_navbar_blog_news">Below Navbar (Blog & News)</option>
          </select>

          <input type="file" name="desktop_image" onChange={handleFileChange} className="border p-2 rounded w-full mb-2" />
          <input type="file" name="mobile_image" onChange={handleFileChange} className="border p-2 rounded w-full mb-2" />

          <input
            type="url"
            name="redirect_url"
            placeholder="Ad Redirect URL"
            value={formData.redirect_url}
            onChange={handleInputChange}
            className="border p-2 rounded w-full mb-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
            />
            Active
          </label>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
            {editMode ? "Update Ad" : "Create Ad"}
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Cancel
          </button>
        </form>
      )}

      {/* ✅ List Ads */}
      {loading ? (
        <p>Loading advertisements...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(ads) && ads.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {ads.map((ad) => (
      <div key={ad.id} className="border p-4 rounded shadow">
        <h3 className="font-semibold">{ad.title}</h3>
        <p className="text-sm">Placement: {ad.placement}</p>
        {ad.desktop_image_url && <img src={ad.desktop_image_url} alt="Desktop" className="w-32 mt-2" />}
        {ad.mobile_image_url && <img src={ad.mobile_image_url} alt="Mobile" className="w-32 mt-2" />}
      </div>
    ))}
  </div>
) : (
  <p>No ads found.</p>
)}

        </div>
      )}
    </div>
  );
};

export default ConfigAd;
