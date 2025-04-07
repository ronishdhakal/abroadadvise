"use client";

import React from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FeaturedDetail = ({ featured }) => {
  if (!featured) return null;

  // ✅ JoditEditor configuration for read-only mode
  const joditConfig = {
    readonly: true,
    toolbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: [],
    style: {
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      backgroundColor: "#f9fafb",
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-[#4c9bd5] pb-2">
        Featured Details
      </h3>
      <div className="space-y-4 text-sm">
        {/* Title */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Title:</span>
          <span className="text-gray-700 flex-1">{featured.title}</span>
        </div>

        {/* Slug */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Slug:</span>
          <span className="text-gray-700 flex-1">{featured.slug}</span>
        </div>

        {/* ✅ Main Title */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Main Title:</span>
          <span className="text-gray-700 flex-1">{featured.main_title || "-"}</span>
        </div>

        {/* ✅ Sub Title */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Sub Title:</span>
          <span className="text-gray-700 flex-1">{featured.sub_title || "-"}</span>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Destination:</span>
          <span className="text-gray-700 flex-1">{featured.destination || "-"}</span>
        </div>

        {/* Description Top */}
        <div className="space-y-2">
          <span className="font-medium text-[#4c9bd5] block">Description Top:</span>
          <div className="border border-gray-200 rounded-lg bg-gray-50">
            <JoditEditor value={featured.description_top || "-"} config={joditConfig} />
          </div>
        </div>

        {/* Description Bottom */}
        <div className="space-y-2">
          <span className="font-medium text-[#4c9bd5] block">Description Bottom:</span>
          <div className="border border-gray-200 rounded-lg bg-gray-50">
            <JoditEditor value={featured.description_bottom || "-"} config={joditConfig} />
          </div>
        </div>

        {/* API Route */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">API Route:</span>
          <span className="text-gray-700 flex-1">{featured.api_route}</span>
        </div>

        {/* Priority */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Priority:</span>
          <span className="text-gray-700 flex-1">{featured.priority}</span>
        </div>

        {/* Active */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Active:</span>
          <span className={`text-gray-700 flex-1 ${featured.is_active ? "text-green-600" : "text-red-600"}`}>
            {featured.is_active ? "Yes" : "No"}
          </span>
        </div>

        {/* Meta Title */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Meta Title:</span>
          <span className="text-gray-700 flex-1">{featured.meta_title || "-"}</span>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <span className="font-medium text-[#4c9bd5] block">Meta Description:</span>
          <div className="border border-gray-200 rounded-lg bg-gray-50">
            <JoditEditor value={featured.meta_description || "-"} config={joditConfig} />
          </div>
        </div>

        {/* Meta Author */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Meta Author:</span>
          <span className="text-gray-700 flex-1">{featured.meta_author || "-"}</span>
        </div>

        {/* Created At */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Created At:</span>
          <span className="text-gray-700 flex-1">
            {new Date(featured.created_at).toLocaleString()}
          </span>
        </div>

        {/* Updated At */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="font-medium text-[#4c9bd5] min-w-[150px]">Updated At:</span>
          <span className="text-gray-700 flex-1">
            {new Date(featured.updated_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDetail;
