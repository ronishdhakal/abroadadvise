import { FaRegComment } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const BlogCard = ({ blog }) => {
  const formattedDate = blog.date ? blog.date.split("T")[0] : "Unknown Date"; // ✅ Prevent error

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden">
      <Link href={`/blog/${blog.slug}`} passHref>
        <div>
          {/* Image Section */}
          <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
            {blog.featured_image_url ? (
              <Image
                src={blog.featured_image_url}
                alt={blog.title}
                width={400}
                height={250}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image Available</span>
            )}

            {/* Category Badge */}
            {blog.category?.name && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md">
                {blog.category.name}
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
              {blog.title}
            </h3>

            {/* Date & Comments */}
            <div className="flex justify-between items-center text-gray-600 text-sm mt-2">
              <span>{formattedDate}</span> {/* ✅ Fix applied */}
              <div className="flex items-center space-x-1">
                <FaRegComment className="w-4 h-4" />
                <span>{blog.comment_count ?? 0}</span> {/* ✅ Ensure comment count isn't undefined */}
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-4">
              <button className="w-full font-medium py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Read More
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
