"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfigDistrict from "@/components/admin/configuration/ConfigDistrict";
import ConfigDisciplines from "@/components/admin/configuration/ConfigDisciplines";
import ConfigAd from "@/components/admin/configuration/ConfigAd";

const ConfigurationsPage = () => {
  const [showDistricts, setShowDistricts] = useState(true);
  const [showDisciplines, setShowDisciplines] = useState(true);
  const [showAds, setShowAds] = useState(true);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔧 Site Configurations</h1>

        {/* Districts Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📍 Districts</h2>
            <button
              onClick={() => setShowDistricts(!showDistricts)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                showDistricts
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-[#4c9bd5] text-white hover:bg-[#3a8cc4]"
              }`}
            >
              {showDistricts ? "Hide" : "Show"}
            </button>
          </div>
          {showDistricts && <ConfigDistrict />}
        </div>

        {/* Disciplines Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📚 Disciplines</h2>
            <button
              onClick={() => setShowDisciplines(!showDisciplines)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                showDisciplines
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-[#4c9bd5] text-white hover:bg-[#3a8cc4]"
              }`}
            >
              {showDisciplines ? "Hide" : "Show"}
            </button>
          </div>
          {showDisciplines && <ConfigDisciplines />}
        </div>

        {/* Advertisements Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📢 Advertisements</h2>
            <button
              onClick={() => setShowAds(!showAds)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                showAds
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-[#4c9bd5] text-white hover:bg-[#3a8cc4]"
              }`}
            >
              {showAds ? "Hide" : "Show"}
            </button>
          </div>
          {showAds && <ConfigAd />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ConfigurationsPage;