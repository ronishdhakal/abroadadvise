import { FaRegComment } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const NewsCard = ({ news }) => {
  if (!news || !news.slug) return null;

  const imageUrl = news.featured_image_url || null;
  const date = news.date ? news.date.split("T")[0] : "Unknown Date";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
      <Link href={`/news/${news.slug}`} passHref>
        <div>
          {/* ✅ Image Section */}
          <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={news.title || "News Image"}
                width={400}
                height={250}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image Available</span>
            )}

            {/* ✅ Category Badge */}
            {news.category?.name && (
              <div className="absolute top-2 left-2 bg-[#4c9bd5] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {news.category.name}
              </div>
            )}
          </div>

          {/* ✅ News Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
              {news.title || "Untitled News"}
            </h3>

            {/* Meta: Date & Comment Count */}
            <div className="flex justify-between items-center text-gray-600 text-sm mt-2">
              <span>{date}</span>
              <div className="flex items-center gap-1">
                <FaRegComment className="w-4 h-4" />
                <span>{news.comment_count ?? 0}</span>
              </div>
            </div>

            {/* ✅ CTA Button */}
            <div className="mt-4">
              <button className="w-full py-2 rounded-lg bg-[#4c9bd5] hover:bg-[#3b87c4] text-white font-medium transition">
                Read More
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
