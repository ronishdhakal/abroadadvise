import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const BlogHeader = ({ blog }) => {
  if (!blog) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back to Blog Link */}
      <div className="mb-4">
        <Link href="/blog" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Link>
      </div>

      {/* Category Badge */}
      {blog.category?.name && (
        <div className="mb-2">
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category.name}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold text-black leading-tight">{blog.title}</h1>

      {/* Author & Date */}
      <p className="text-gray-500 text-sm mt-2">
        By <span className="font-medium text-gray-700">{blog.author_name}</span> •{" "}
        {new Date(blog.published_date).toLocaleDateString()}
      </p>

      {/* Featured Image */}
      <div className="mt-4">
        {blog.featured_image_url ? (
          <Image
            src={blog.featured_image_url}
            alt={blog.title}
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
    </div>
  );
};

export default BlogHeader;
