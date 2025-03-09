import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const NewsHeader = ({ news }) => {
  if (!news) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">  {/* Increased max-width */}
      {/* Back to News Link */}
      <div className="mb-4">
        <Link href="/news" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>
      </div>

      {/* Category Badge */}
      {news.category?.name && (
        <div className="mb-2">
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
            {news.category.name}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold text-black leading-tight">{news.title}</h1> {/* Increased text size */}

      {/* Date */}
      <p className="text-gray-500 text-sm mt-2">{news.date.split("T")[0]}</p>

      {/* Featured Image */}
      <div className="mt-4">
        {news.featured_image_url ? (
          <Image
            src={news.featured_image_url}
            alt={news.title}
            width={1100}  // Increased width
            height={550}   // Adjusted height
            className="w-full rounded-lg object-cover"
            priority
          />
        ) : (
          <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg"> {/* Increased height */}
            <span className="text-gray-400 text-sm">No Image Available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsHeader;
