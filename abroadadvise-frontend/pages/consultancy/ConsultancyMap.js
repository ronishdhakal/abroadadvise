"use client";

import { ExternalLink } from "lucide-react";

const ConsultancyMap = ({ google_map_url }) => {
  if (!google_map_url) return null;

  // Convert embed URL to regular Google Maps link if needed
  const directMapLink = google_map_url.includes("embed?")
    ? google_map_url.replace("/embed?", "/?")
    : google_map_url;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>

      <a
        href={directMapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full px-4 py-2 text-blue-600 border rounded-md hover:bg-gray-100 transition"
      >
        View on Google Maps <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    </div>
  );
};

export default ConsultancyMap;
