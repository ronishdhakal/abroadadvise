"use client";

import {
  Globe,
  Hash,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  MessageSquare,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const UniversityOverview = ({ university = {} }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareRef = useRef(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleShareClick = () => {
    setIsShareOpen(!isShareOpen);
  };

  const handleCopyClick = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsShareOpen(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 bg-white">
      {/* Left: University Info Badges */}
      <div className="flex flex-wrap items-center gap-3 text-gray-700">
        {university.type && (
          <span className="px-3 py-1 text-sm font-medium text-[#4c9bd5] bg-[#e3f2fc] rounded-full">
            {university.type === "private"
              ? "Private University"
              : "Community University"}
          </span>
        )}

        {university.tuition_fees && (
          <span className="text-sm sm:text-base text-gray-600">
            Tuition: {university.tuition_fees} per year
          </span>
        )}

        {university.qs_world_ranking && (
          <span className="flex items-center px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
            <Hash className="h-4 w-4 mr-1 text-purple-500" />
            QS Ranking: {university.qs_world_ranking}
          </span>
        )}
      </div>

      {/* Right: Website / Brochure / Share */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative" ref={shareRef}>
        {university.website && (
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#4c9bd5] hover:underline text-sm sm:text-base"
          >
            <Globe className="h-4 w-4 mr-1" />
            Visit Website
          </a>
        )}

        {university.brochure && (
          <a
            href={university.brochure}
            download
            className="px-4 py-2 text-sm sm:text-base font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Download Brochure
          </a>
        )}

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={handleShareClick}
            className="px-4 py-2 text-sm sm:text-base font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {isShareOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                    X
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:?body=${encodeURIComponent(shareUrl)}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Mail className="h-4 w-4 mr-2 text-red-500" />
                    Email
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleCopyClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4 mr-2 text-gray-500" />
                    Copy Link
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityOverview;
