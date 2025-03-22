import { Globe, Hash, Share2, Facebook, Twitter, Linkedin, Mail, Copy, MessageSquare } from "lucide-react"; // ✅ Import necessary icons
import { useState, useRef, useEffect } from "react";

const UniversityOverview = ({ university }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareRef = useRef(null);

  const handleShareClick = () => {
    setIsShareOpen(!isShareOpen);
  };

  // ✅ Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Generate share URL
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // ✅ Copy to Clipboard
  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsShareOpen(false); // Close dropdown after copying
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200">
      {/* Left Section: University Type, Tuition Fees, & QS Ranking */}
      <div className="flex flex-wrap items-center gap-3 text-gray-700">
        {/* University Type Badge */}
        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
          {university.type === "private" ? "Private University" : "Community University"}
        </span>

        {/* Tuition Fees */}
        {university.tuition_fees && (
          <span className="text-sm sm:text-base text-gray-600">
            Tuition: {university.tuition_fees} per year
          </span>
        )}
        {/* QS World Ranking */}
        {university.qs_world_ranking && (
          <span className="flex items-center px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
            <Hash className="h-4 w-4 mr-1 text-purple-500" /> {/* QS Ranking Icon */}
            QS Ranking: {university.qs_world_ranking}
          </span>
        )}
      </div>

      {/* Right Section: Website, Brochure, & Share */}
      <div className="flex flex-wrap items-center gap-4 relative" ref={shareRef}>
        {/* Website Link */}
        {university.website && (
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:underline text-sm sm:text-base"
          >
            <Globe className="h-4 w-4 mr-1" />
            Visit Website
          </a>
        )}

        {/* Download Brochure Button */}
        {university.brochure && (
          <a
            href={university.brochure}
            download
            className="px-4 py-2 text-sm sm:text-base font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Download Brochure
          </a>
        )}

        {/* Share Button (Desktop & Mobile) */}
        <div className="relative">
          <button
            onClick={handleShareClick}
            className="px-4 py-2 text-sm sm:text-base font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* Share Dropdown (Desktop) */}
          {isShareOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                {/* Facebook */}
                <li>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Facebook
                  </a>
                </li>
                {/* X */}
                <li>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                    X
                  </a>
                </li>
                {/* LinkedIn */}
                <li>
                  <a
                    href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    LinkedIn
                  </a>
                </li>
                {/* WhatsApp */}
                <li>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                    WhatsApp
                  </a>
                </li>
                {/* Email */}
                <li>
                  <a
                    href={`mailto:?body=${encodeURIComponent(shareUrl)}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Mail className="h-4 w-4 mr-2 text-red-500" />
                    Email
                  </a>
                </li>
                {/* Copy Link */}
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
