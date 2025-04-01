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
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-10 flex items-center">
          <svg
            className="w-8 h-8 mr-3 text-[#4c9bd5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Site Configurations
        </h1>

        {/* Districts Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-[#4c9bd5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Districts
            </h2>
            <button
              onClick={() => setShowDistricts(!showDistricts)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showDistricts
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-[#4c9bd5] text-white hover:bg-opacity-90"
              }`}
            >
              {showDistricts ? "Hide" : "Show"}
            </button>
          </div>
          {showDistricts && <ConfigDistrict />}
        </div>

        {/* Disciplines Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-[#4c9bd5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                />
              </svg>
              Disciplines
            </h2>
            <button
              onClick={() => setShowDisciplines(!showDisciplines)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showDisciplines
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-[#4c9bd5] text-white hover:bg-opacity-90"
              }`}
            >
              {showDisciplines ? "Hide" : "Show"}
            </button>
          </div>
          {showDisciplines && <ConfigDisciplines />}
        </div>

        {/* Advertisements Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-[#4c9bd5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Advertisements
            </h2>
            <button
              onClick={() => setShowAds(!showAds)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showAds
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-[#4c9bd5] text-white hover:bg-opacity-90"
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