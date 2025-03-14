"use client";

import { useState } from "react";
import ConfigAd from "./configuration/ConfigAd";
import ConfigSite from "./configuration/ConfigSite";
import ConfigDistrict from "./configuration/ConfigDistrict";
import ConfigDisciplines from "./configuration/ConfigDisciplines";

const Configuration = () => {
  const [activeTab, setActiveTab] = useState("ads");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Configurations</h1>

      {/* ✅ Navigation Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "ads" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("ads")}
        >
          Advertisements
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "site" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("site")}
        >
          Site Settings
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "districts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("districts")}
        >
          Districts
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "disciplines" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("disciplines")}
        >
          Disciplines
        </button>
      </div>

      {/* ✅ Dynamic Content Based on Active Tab */}
      <div className="mt-4">
        {activeTab === "ads" && <ConfigAd />}
        {activeTab === "site" && <ConfigSite />}
        {activeTab === "districts" && <ConfigDistrict />}
        {activeTab === "disciplines" && <ConfigDisciplines />}
      </div>
    </div>
  );
};

export default Configuration;
