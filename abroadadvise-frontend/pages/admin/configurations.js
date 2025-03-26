"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfigDistrict from "@/components/admin/configuration/ConfigDistrict";
import ConfigDisciplines from "@/components/admin/configuration/ConfigDisciplines";
import ConfigAd from "@/components/admin/configuration/ConfigAd"; // ✅ Add this

const ConfigurationsPage = () => {
  const [showDistricts, setShowDistricts] = useState(true);
  const [showDisciplines, setShowDisciplines] = useState(true);
  const [showAds, setShowAds] = useState(true); // ✅ For advertisements

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">🔧 Site Configurations</h1>

      {/* ✅ Districts Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-blue-600">📍 Districts</h2>
          <button
            onClick={() => setShowDistricts(!showDistricts)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {showDistricts ? "Hide" : "Show"}
          </button>
        </div>
        {showDistricts && <ConfigDistrict />}
      </div>

      {/* ✅ Disciplines Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-green-600">📚 Disciplines</h2>
          <button
            onClick={() => setShowDisciplines(!showDisciplines)}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {showDisciplines ? "Hide" : "Show"}
          </button>
        </div>
        {showDisciplines && <ConfigDisciplines />}
      </div>

      {/* ✅ Advertisements Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-purple-600">📢 Advertisements</h2>
          <button
            onClick={() => setShowAds(!showAds)}
            className="bg-purple-500 text-white px-4 py-2 rounded-md"
          >
            {showAds ? "Hide" : "Show"}
          </button>
        </div>
        {showAds && <ConfigAd />}
      </div>
    </AdminLayout>
  );
};

export default ConfigurationsPage;
