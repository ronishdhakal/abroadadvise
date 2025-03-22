"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { API_BASE_URL } from "@/utils/api"; // ✅ Centralized API URL

export default function RoadblockAd() {
  const [showAd, setShowAd] = useState(false);
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const hasSeenAd = sessionStorage.getItem("hasSeenRoadblockAd");
    if (hasSeenAd) return;

    const fetchAd = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ads/?placement=roadblock_ad`);
        const data = await res.json();

        if (data.results.length > 0) {
          setAd(data.results[0]);
          setShowAd(true);
          sessionStorage.setItem("hasSeenRoadblockAd", "true");
        }
      } catch (error) {
        console.error("Error fetching roadblock ad:", error);
      }
    };

    fetchAd();
  }, []);

  const closeAd = () => {
    setShowAd(false);
  };

  if (!showAd || !ad) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Subtle Overlay with Minimal Blur */}
      <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-[0.5px] pointer-events-none" />

      {/* Ad Container */}
      <div className="relative max-w-4xl w-full sm:max-w-3xl pointer-events-auto animate-in fade-in zoom-in-95 duration-300 z-60">
        {/* Card Container */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Close Button */}
          <button
            onClick={closeAd}
            className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-gray-100 text-gray-800 p-1.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Close advertisement"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>

          {/* Ad Content */}
          <a
            href={ad.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
          >
            {/* Desktop Version */}
            <div className="hidden sm:block">
              <Image
                src={ad.desktop_image_url || "/placeholder.svg"}
                alt={ad.title}
                width={960}
                height={540}
                className="w-full h-auto object-cover max-h-[80vh]"
                priority
              />
            </div>

            {/* Mobile Version */}
            <div className="sm:hidden">
              <Image
                src={ad.mobile_image_url || "/placeholder.svg"}
                alt={ad.title}
                width={320}
                height={400}
                className="w-full h-auto object-cover max-h-[65vh]"
                priority
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
