"use client";

import { ExternalLink } from "lucide-react";

const ConsultancyMap = ({ google_map_url, consultancyName = "this consultancy" }) => {
  if (!google_map_url) return null;

  // Convert embed link to direct map link
  const directMapLink = google_map_url.includes("embed?")
    ? google_map_url.replace("/embed?", "/?")
    : google_map_url;

  return (
    <section
      className="bg-white p-6 rounded-lg shadow-md"
      aria-labelledby="consultancy-map-heading"
    >
      <h2
        id="consultancy-map-heading"
        className="text-lg font-semibold text-gray-900 mb-3"
      >
        Location
      </h2>

      <a
        href={directMapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full px-4 py-2 text-blue-600 border border-gray-200 rounded-md hover:bg-gray-100 transition"
        aria-label={`View ${consultancyName} location on Google Maps`}
      >
        View on Google Maps <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
};

export default ConsultancyMap;
