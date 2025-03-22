import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/utils/api"; // ✅ Import API base URL

const NewsHeader = ({ news }) => {
  const [aboveHeadlineAd, setAboveHeadlineAd] = useState(null);
  const [belowHeadlineAd, setBelowHeadlineAd] = useState(null);
  const [belowImageAd, setBelowImageAd] = useState(null);

  // ✅ Fetch Ads for Different Placements
  useEffect(() => {
    const fetchAd = async (placement, setAd) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ads/?placement=${placement}`);
        const data = await res.json();
        if (data.results.length > 0) {
          setAd(data.results[0]); // ✅ Get the first ad if available
        }
      } catch (error) {
        console.error(`Error fetching ${placement} ad:`, error);
      }
    };

    fetchAd("above_headline_blog_news", setAboveHeadlineAd);
    fetchAd("below_headline_blog_news", setBelowHeadlineAd);
    fetchAd("below_featured_image_blog_news", setBelowImageAd);
  }, []);

  if (!news) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ✅ Back to News Link */}
      <div className="mb-4">
        <Link href="/news" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>
      </div>

      {/* ✅ Full-Width Ad Above News Title */}
      {aboveHeadlineAd && (
        <div className="w-full flex justify-start items-center mb-4">
          <a href={aboveHeadlineAd.redirect_url} target="_blank" rel="noopener noreferrer">
            <Image
              src={aboveHeadlineAd.desktop_image_url}
              alt={aboveHeadlineAd.title}
              width={1200}
              height={150}
              className="object-cover"
            />
          </a>
        </div>
      )}

      {/* ✅ News Category */}
      {news.category?.name && (
        <div className="mb-2">
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
            {news.category.name}
          </span>
        </div>
      )}

      {/* ✅ Title */}
      <h1 className="text-4xl font-bold text-black leading-tight">{news.title}</h1>

      {/* ✅ Full-Width Ad Below Title */}
      {belowHeadlineAd && (
        <div className="w-full flex justify-start items-center mt-4">
          <a href={belowHeadlineAd.redirect_url} target="_blank" rel="noopener noreferrer">
            <Image
              src={belowHeadlineAd.desktop_image_url}
              alt={belowHeadlineAd.title}
              width={1200}
              height={150}
              className="object-cover"
            />
          </a>
        </div>
      )}

      {/* ✅ Date */}
      <p className="text-gray-500 text-sm mt-2">{news.date.split("T")[0]}</p>

      {/* ✅ Featured Image */}
      <div className="mt-4">
        {news.featured_image_url ? (
          <Image
            src={news.featured_image_url}
            alt={news.title}
            width={1100}
            height={550}
            className="w-full rounded-lg object-cover"
            priority
          />
        ) : (
          <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">
            <span className="text-gray-400 text-sm">No Image Available</span>
          </div>
        )}
      </div>

      {/* ✅ Ad Below Image */}
      {belowImageAd && (
        <div className="w-full flex justify-start items-center mt-4">
          <a href={belowImageAd.redirect_url} target="_blank" rel="noopener noreferrer">
            <Image
              src={belowImageAd.desktop_image_url}
              alt={belowImageAd.title}
              width={1200}
              height={150}
              className="object-cover"
            />
          </a>
        </div>
      )}
    </div>
  );
};

export default NewsHeader;
